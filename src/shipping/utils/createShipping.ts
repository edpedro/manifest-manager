import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { format, Locale } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

type Decimal = any;

interface ShippingData {
  id: number;
  name: string;
  cpf: string;
  placa: string;
  dispatch_date: Date | string | null;
  transport: string;
  status: string | null;
  estimatedArrival: string;
  shipmentShipping: Array<{
    shipment: {
      id: number;
      st: string;
      supply: string;
      invoice_number: string;
      invoice_issue_date: string | Date;
      destination: string;
      city: string;
      uf: string;
      carrier: string;
      transport_mode: string;
      category: string;
      Valeu_invoice: string | Decimal;
      name: string | null;
      cpf: string | null;
      dispatch_date: Date | null;
      dispatch_time: string | null;
      transport: string | null;
      status: string | null;
      created_at: Date;
      observation: string | null;
    };
  }>;
  user: {
    id: string;
    first_name: string;
  };
}

export async function generateRomaneioExcel(data: ShippingData) {
  // Verificar e converter datas se necessário
  const dispatchDate = data.dispatch_date
    ? new Date(data.dispatch_date)
    : new Date();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('ROMANEIO');

  // Tamanho das colunas - Pula a primeira coluna e começa da segunda
  sheet.columns = [
    { width: 5 }, // Coluna A (menor, pois será pulada)
    { width: 15 }, // Coluna B (agora é a primeira coluna útil)
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  // Cabeçalho: título e logo
  sheet.mergeCells('B1:G1');
  sheet.getCell('B1').value = 'ROMANEIO DE EXPEDIÇÃO - TELEFÔNICA';
  sheet.getCell('B1').font = { bold: true, size: 14 };
  sheet.getCell('B1').alignment = { horizontal: 'center' };

  // Endereço
  sheet.mergeCells('B3:D4');
  sheet.getCell('B3').value =
    'Rod. Empresário João Santos Filho, 533 - Bloco C - Muribeca, Jaboatão dos Guararapes - PE, 54355-030 CNPJ 03.558.055/0001-00';
  sheet.getCell('B3').alignment = { vertical: 'middle', wrapText: true };
  sheet.getCell('B3').border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  // Logo
  // sheet.mergeCells('H3:J4');
  // sheet.getCell('H3').value = 'IBL';

  // Dados do transporte
  sheet.getCell('B6').value = 'MANIFESTO';
  sheet.getCell('F6').value = 'DATA';
  sheet.getCell('F7').value = 'Hora Expedição';
  sheet.getCell('G6').value = format(dispatchDate, 'dd/MM/yyyy', {
    locale: ptBR as Locale,
  });
  // sheet.getCell('G7').value = format(data.estimatedArrival, 'HH:mm', {
  //   locale: ptBR as Locale,
  // });

  sheet.getCell('B7').value = 'TRANSPORTE';
  sheet.getCell('C7').value = data.transport.toUpperCase() || '';

  sheet.getCell('B8').value = 'PLACA';
  sheet.getCell('C8').value = data.placa.toUpperCase(); // Adicione a placa se disponível

  sheet.getCell('B9').value = 'MOTORISTA';
  sheet.getCell('C9').value = data.name.toUpperCase() || '';

  sheet.getCell('B10').value = 'CPF';
  sheet.getCell('C10').value = data.cpf || '';

  sheet.getCell('B12').value = 'DEPOSITANTE';
  sheet.getCell('C12').value = 'TELEFÔNICA';
  sheet.getCell('D12').value = `Total NF: ${data.shipmentShipping.length}`;

  // Cabeçalho da tabela de dados - começando da coluna B
  const header = [
    'ST',
    'Fornecimento',
    'Nota fiscal',
    'Data de Emissão da NF',
    'Destino',
    'Transportadora',
  ];

  sheet.addRow([]);
  const headerRow = sheet.addRow(['', ...header]); // Adiciona célula vazia no início para pular a coluna A

  // Aplicar estilo apenas às células que contêm dados (de B a J)
  for (let i = 2; i <= 7; i++) {
    const cell = headerRow.getCell(i);
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }

  // Dados dos shipments - pulando a primeira coluna
  for (const item of data.shipmentShipping) {
    const shipment = item.shipment;
    const invoiceDate = shipment.invoice_issue_date
      ? new Date(shipment.invoice_issue_date)
      : new Date();

    sheet.addRow([
      '', // Célula vazia para a coluna A
      shipment.st,
      shipment.supply,
      shipment.invoice_number,
      format(invoiceDate, 'dd/MM/yyyy', { locale: ptBR as Locale }),
      shipment.city.toUpperCase(),
      data.transport.toUpperCase(),
    ]);
  }

  // Rodapé - calculando dinamicamente a posição
  sheet.addRow([]);
  sheet.addRow([]);
  sheet.addRow([]);

  const footerRow = sheet.lastRow?.number || sheet.rowCount;

  // Assinaturas na linha 46 (se possível) ou abaixo dos dados
  const signatureRow = Math.max(46, footerRow);

  // Assinaturas
  sheet.mergeCells(`B${signatureRow}:E${signatureRow}`);
  sheet.getCell(`B${signatureRow}`).value =
    'Assinatura Conferênte: ____________________________';

  sheet.mergeCells(`F${signatureRow}:I${signatureRow}`);
  sheet.getCell(`F${signatureRow}`).value =
    'Assinatura Transportador: _____________________';

  // Data da coleta duas linhas abaixo, centralizada
  sheet.mergeCells(`C${signatureRow + 3}:F${signatureRow + 3}`);
  sheet.getCell(`C${signatureRow + 3}`).value =
    `Data da Coleta:______/______/______`;
  sheet.getCell(`C${signatureRow + 3}`).alignment = { horizontal: 'center' };

  // Exportar
  // const buffer = await workbook.xlsx.writeBuffer();
  // response.set({
  //   'Content-Type':
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   'Content-Disposition': `attachment; filename=romaneio_${data.id}.xlsx`,
  //   'Content-Length': Buffer.byteLength(buffer),
  // });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
