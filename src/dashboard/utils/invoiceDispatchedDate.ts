import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

interface GroupedInvoiceData {
  invoice_issue_date: string;
  invoice: number;
  dispatched: number;
}

export async function invoiceDispatchedDate(shipments: ShipmentDto[]) {
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

  for (const shipment of shipments) {
    const formattedDate = parseDateStringToUTC(shipment.invoice_issue_date);

    const existingEntry = groupedInvoices.find(
      (entry) => entry.invoice_issue_date === formattedDate,
    );

    if (existingEntry) {
      existingEntry.invoice += 1;
      if (shipment.status === 'Expedido') {
        existingEntry.dispatched += 1;
      }
    } else {
      groupedInvoices.push({
        invoice_issue_date: formattedDate,
        invoice: 1,
        dispatched: shipment.status === 'Expedido' ? 1 : 0,
      });
    }
  }

  return { groupedInvoices };
}
