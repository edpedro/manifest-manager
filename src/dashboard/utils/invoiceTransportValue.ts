interface TransportValue {
  name: string;
  valeu: number;
}

export class ShipmentDto {
  id: number;
  st: string;
  supply: string;
  invoice_number: string;
  invoice_issue_date: Date;
  destination: string;
  city: string;
  uf: string;
  carrier: string;
  transport_mode: string;
  Valeu_invoice: number;
  category: string;
  name?: string | null;
  transport?: string | null;
  cpf?: string | null;
  dispatch_date?: Date | null;
  dispatch_time?: string | null;
  status?: string | null;
  observation?: string | null;
  user: {
    id: string;
    first_name: string;
  };
}

export async function invoiceTransportValue(data: ShipmentDto[]) {
  const invoiceTransportValueMap: Record<string, number> = {};

  data.forEach((item) => {
    if (item.transport) {
      const key = item.transport;
      invoiceTransportValueMap[key] =
        (invoiceTransportValueMap[key] || 0) + Number(item.Valeu_invoice);
    }
  });

  const invoiceTransportValueTotal: TransportValue[] = Object.entries(
    invoiceTransportValueMap,
  ).map(([name, valeu]) => ({ name, valeu }));

  const top5InvoiceTransportValueTotal = invoiceTransportValueTotal
    .sort((a, b) => b.valeu - a.valeu)
    .slice(0, 5);

  return { top5InvoiceTransportValueTotal };
}
