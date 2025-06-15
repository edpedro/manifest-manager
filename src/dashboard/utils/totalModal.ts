import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export interface Modal {
  name: string;
  total: number;
}

export async function totalModal(data: ShipmentDto[]) {
  const modalMap: Record<string, number> = {};

  data.forEach((item) => {
    const key = item.transport_mode?.replace(' ', '_') || 'outros';
    if (item.Valeu_invoice) {
      modalMap[key] = (modalMap[key] || 0) + Number(item.Valeu_invoice);
    }
  });

  const modalTotal: Modal[] = Object.entries(modalMap).map(([name, total]) => ({
    name,
    total,
  }));

  return { modalTotal };
}
