import * as XLSX from 'xlsx';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UploadDto } from 'src/upload/file-upload.dto';
import { CreateShipmentDto } from '../dto/create-shipment.dto';

const FIELD_NAMES = {
  st: 'ST',
  supply: 'Fornecimento',
  invoice_number: 'Nota fiscal',
  invoice_issue_date: 'Data de Emissão da NF',
  destination: 'Destino',
  carrier: 'Transportadora',
  transport_mode: 'Modal',
  Valeu_invoice: 'Valor',
  category: 'Categoria',
  name: 'Nome',
  transport: 'Transporte',
  cpf: 'CPF',
  dispatch_date: 'Data Expedição',
  dispatch_time: 'Hora Expedição',
};

export async function expeditionExcelManager(
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

  function validateColumns(data: Record<string, any>[]) {
    const headerKeys = Object.keys(data[0])
      .map((k) => k.trim())
      .sort();
    const expectedKeys = Object.values(FIELD_NAMES)
      .map((k) => k.trim())
      .sort();

    const isValid = expectedKeys.every(
      (key, index) => key === headerKeys[index],
    );

    if (!isValid) {
      throw new HttpException(
        'As colunas do Excel não correspondem',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  function transformToDto(data: Record<string, any>[]): CreateShipmentDto[] {
    return data.map((row, index) => {
      const requiredFields = [
        FIELD_NAMES.st,
        FIELD_NAMES.supply,
        FIELD_NAMES.invoice_number,
        FIELD_NAMES.invoice_issue_date,
        FIELD_NAMES.destination,
        FIELD_NAMES.carrier,
        FIELD_NAMES.transport_mode,
        FIELD_NAMES.Valeu_invoice,
        FIELD_NAMES.category,
        FIELD_NAMES.name,
        FIELD_NAMES.transport,
        FIELD_NAMES.cpf,
        FIELD_NAMES.dispatch_date,
        FIELD_NAMES.dispatch_time,
      ];

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

      return {
        st: String(row[FIELD_NAMES.st]),
        supply: String(row[FIELD_NAMES.supply]),
        invoice_number: String(row[FIELD_NAMES.invoice_number]),
        invoice_issue_date: parseExcelDate(row[FIELD_NAMES.invoice_issue_date]),
        destination: String(row[FIELD_NAMES.destination]).toUpperCase(),
        carrier: String(row[FIELD_NAMES.carrier]).toUpperCase(),
        transport_mode: String(row[FIELD_NAMES.transport_mode]).toUpperCase(),
        Valeu_invoice: Number(row[FIELD_NAMES.Valeu_invoice]),
        category: String(row[FIELD_NAMES.category]),
        name: String(row[FIELD_NAMES.name]),
        transport: String(row[FIELD_NAMES.transport]),
        cpf: String(row[FIELD_NAMES.cpf]),
        dispatch_date: parseExcelDate(row[FIELD_NAMES.dispatch_date]),
        dispatch_time: parseExcelTime(row[FIELD_NAMES.dispatch_time]),
        user_id: user,
      };
    });
  }

  function parseExcelDate(dateCell: any): string {
    if (!dateCell) return new Date().toISOString();

    if (typeof dateCell === 'string') {
      const parsed = new Date(dateCell);
      return isNaN(parsed.getTime())
        ? new Date().toISOString()
        : parsed.toISOString();
    }

    if (typeof dateCell === 'number') {
      const excelDate = XLSX.SSF.parse_date_code(dateCell);
      if (!excelDate || !excelDate.y) return new Date().toISOString();

      const jsDate = new Date(excelDate.y, excelDate.m - 1, excelDate.d);
      return jsDate.toISOString(); // <- aqui está o formato ISO-8601
    }

    return new Date().toISOString();
  }
  function parseExcelTime(timeCell: any): string {
    if (!timeCell) return '00:00';

    if (typeof timeCell === 'string') {
      const match = timeCell.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
      if (match) return match[0];
      return '00:00'; // inválido, define como padrão
    }

    if (typeof timeCell === 'number') {
      // Excel armazena horas como frações de 1 (0.5 = 12:00)
      const totalMinutes = Math.round(timeCell * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(hours)}:${pad(minutes)}`;
    }

    return '00:00';
  }
  validateColumns(dataJson);

  return transformToDto(dataJson);
}
