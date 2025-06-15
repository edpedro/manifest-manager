import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

interface City {
  name: string;
  total: number;
}

export async function invoiceCityTotal(data: ShipmentDto[]) {
  const invoiceCityMap: Record<string, number> = {};

  data.forEach((item) => {
    const key = item.city?.replace(' ', '_') || 'outros';
    invoiceCityMap[key] = (invoiceCityMap[key] || 0) + 1;
  });

  const invoiceCityTotal: City[] = Object.entries(invoiceCityMap).map(
    ([name, total]) => ({ name, total }),
  );

  const top10InvoiceCityTotal = invoiceCityTotal
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return { top10InvoiceCityTotal };
}
