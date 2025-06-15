import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export interface UF {
  name: string;
  total: number;
}

export async function invoiceUFTotal(data: ShipmentDto[]) {
  const invoiceUFMap: Record<string, number> = {};

  data.forEach((item) => {
    const key = item.uf?.replace(' ', '_') || 'outros';
    invoiceUFMap[key] = (invoiceUFMap[key] || 0) + 1;
  });

  const invoiceUfTotal: UF[] = Object.entries(invoiceUFMap).map(
    ([name, total]) => ({ name, total }),
  );

  const top10InvoiceUfTotal = invoiceUfTotal
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return { top10InvoiceUfTotal };
}
