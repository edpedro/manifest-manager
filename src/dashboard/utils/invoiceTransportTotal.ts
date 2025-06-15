import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export interface Transport {
  name: string;
  total: number;
}

export async function invoiceTransportTotal(data: ShipmentDto[]) {
  const invoiceTransportMap: Record<string, number> = {};

  data.forEach((item) => {
    if (item.transport) {
      const key = item.transport;
      invoiceTransportMap[key] = (invoiceTransportMap[key] || 0) + 1;
    }
  });

  const invoiceTransportTotal: Transport[] = Object.entries(
    invoiceTransportMap,
  ).map(([name, total]) => ({ name, total }));

  const top10InvoiceTransportTotal = invoiceTransportTotal
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return { top10InvoiceTransportTotal };
}
