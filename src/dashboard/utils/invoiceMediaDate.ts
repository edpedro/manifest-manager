import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

interface GroupedInvoiceData {
  invoice_issue_date: string;
  invoice: number;
  dispatched: number;
}

export async function invoiceMediaDate(shipments: ShipmentDto[]) {
  const groupedInvoices: GroupedInvoiceData[] = [];

  function parseDateStringToUTC(dateInput: any): string {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      date = new Date(excelEpoch.getTime() + dateInput * 86400000);
    } else if (typeof dateInput === 'string') {
      const [day, month, year] = dateInput.split('/').map(Number);
      if (!day || !month || !year) {
        throw new Error(`Data inválida: ${dateInput}`);
      }

      date = new Date(Date.UTC(year, month - 1, day, 12));
    } else {
      throw new Error(
        `Formato de data não suportado: ${JSON.stringify(dateInput)}`,
      );
    }

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${year}-${month}-${day}`;
  }

  const data = [
    {
      nf: '1',
      dataEntrada: '2025-06-04T19:24:00.000Z',
      dataFinal: '2025-06-05T19:24:00.000Z',
    },
    {
      nf: '2',
      dataEntrada: '2025-06-04T19:24:00.000Z',
      dataFinal: '2025-06-05T19:24:00.000Z',
    },
    {
      nf: '3',
      dataEntrada: '2025-06-04T19:24:00.000Z',
      dataFinal: '2025-06-05T19:24:00.000Z',
    },
    {
      nf: '4',
      dataEntrada: '2025-06-04T19:24:00.000Z',
      dataFinal: '2025-06-06T19:24:00.000Z',
    },
  ];

  let totalDia = 0;
  let totalNF = 0;

  function formatarDataParaComparacao(data) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  }
  for (const i of data) {
    const data1 = formatarDataParaComparacao(new Date(i.dataEntrada));
    const data2 = formatarDataParaComparacao(new Date(i.dataFinal));

    totalDia += data2.getDate() - data1.getDate();
    totalNF += 1;
  }

  const media = totalDia / totalNF;

  console.log(media);

  return { groupedInvoices };
}
