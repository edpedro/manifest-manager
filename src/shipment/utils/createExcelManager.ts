import * as XLSX from 'xlsx';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UploadDto } from 'src/upload/file-upload.dto';
import { CreateShipmentDto } from '../dto/create-shipment.dto';

const FIELD_NAMES = {
  st: 'ST',
  supply: 'Fornecimento',
  invoice_number: 'Nota fiscal',
  invoice_issue_date: 'Data de Emissão da NF',
  destination: 'Destinatario',
  city: 'Cidade',
  uf: 'UF',
  carrier: 'Transportadora',
  transport_mode: 'Modal',
  Valeu_invoice: 'Valor',
  category: 'Categoria',
};

export async function createExcelManager(
  file: UploadDto,
  user: string,
): Promise<CreateShipmentDto[]> {
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const dataJson = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  if (!dataJson.length) {
    throw new HttpException(
      'O arquivo está vazio ou ilegível.',
      HttpStatus.BAD_REQUEST,
    );
  }

  function validateColumnsFromSheet(sheet: XLSX.WorkSheet) {
    const range = XLSX.utils.decode_range(sheet['!ref'] || '');
    const firstRow = range.s.r;
    const expectedHeaders = Object.values(FIELD_NAMES).map((v) => v.trim());

    const headersFromSheet: string[] = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: firstRow, c: col });
      const cell = sheet[cellAddress];
      const header = cell?.v?.toString().trim();

      if (!header) continue;
      headersFromSheet.push(header);
    }

    const missing = expectedHeaders.filter(
      (header) => !headersFromSheet.includes(header),
    );

    if (missing.length) {
      throw new HttpException(
        `As colunas do Excel não correspondem às esperadas. Faltando: ${missing.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  function transformToDto(data: Record<string, any>[]): CreateShipmentDto[] {
    return data.map((row, index) => {
      const requiredFields = Object.values(FIELD_NAMES);

      const missingFields = requiredFields.filter((field) => {
        const value = row[field];
        return (
          value === undefined || value === null || String(value).trim() === ''
        );
      });

      if (missingFields.length > 0) {
        throw new BadRequestException(
          `Linha ${index + 1} contém campos obrigatórios vazios: ${missingFields.join(', ')}`,
        );
      }

      // --- Categoria
      const allowedCategories = [
        'CASA CLIENTE',
        'REDE EXTERNA',
        'FERRAMENTAL',
        'MARKETING',
        'ENGENHARIA',
      ];
      const categoryValue = String(row[FIELD_NAMES.category]).toUpperCase();

      if (!allowedCategories.includes(categoryValue)) {
        throw new BadRequestException(
          `Linha ${index + 1} contém uma categoria inválida: "${categoryValue}". As categorias permitidas são: ${allowedCategories.join(', ')}.`,
        );
      }

      // --- Modal (Transport Mode)
      let transportModeRaw = String(row[FIELD_NAMES.transport_mode])
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      let transportModeFormatted = '';

      if (transportModeRaw === 'AEREO') {
        transportModeFormatted = 'AÉREO';
      } else if (transportModeRaw === 'RODOVIARIO') {
        transportModeFormatted = 'RODOVIÁRIO';
      } else {
        throw new BadRequestException(
          `Linha ${index + 1} contém um modal inválido: "${row[FIELD_NAMES.transport_mode]}". Os valores permitidos são: AÉREO, RODOVIÁRIO.`,
        );
      }

      return {
        st: String(row[FIELD_NAMES.st]),
        supply: String(row[FIELD_NAMES.supply]),
        invoice_number: String(row[FIELD_NAMES.invoice_number]),
        invoice_issue_date: parseDateStringToUTC(
          row[FIELD_NAMES.invoice_issue_date],
        ),
        destination: String(row[FIELD_NAMES.destination]).toUpperCase(),
        city: String(row[FIELD_NAMES.city]).toUpperCase(),
        uf: String(row[FIELD_NAMES.uf]).toUpperCase(),
        carrier: String(row[FIELD_NAMES.carrier]).toUpperCase(),
        transport_mode: transportModeFormatted,
        Valeu_invoice: Number(row[FIELD_NAMES.Valeu_invoice]),
        category: categoryValue,
        user_id: user,
      };
    });
  }

  function parseDateStringToUTC(dateInput: any): string {
    if (dateInput instanceof Date) {
      return dateInput.toISOString();
    }

    if (typeof dateInput === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const utcDate = new Date(excelEpoch.getTime() + dateInput * 86400000);
      return utcDate.toISOString();
    }

    if (typeof dateInput === 'string') {
      const [day, month, year] = dateInput.split('/').map(Number);

      if (!day || !month || !year) {
        throw new Error(`Data inválida: ${dateInput}`);
      }

      const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
      return utcDate.toISOString();
    }

    throw new Error(
      `Formato de data não suportado: ${JSON.stringify(dateInput)}`,
    );
  }

  validateColumnsFromSheet(sheet);

  return transformToDto(dataJson);
}
