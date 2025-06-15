import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

interface Category {
  name: string;
  total: number;
}

export async function totalCategory(data: ShipmentDto[]) {
  const categoryMap: Record<string, number> = {};

  data.forEach((item) => {
    const key = item.category?.replace(' ', '_') || 'outros';
    categoryMap[key] = (categoryMap[key] || 0) + 1;
  });

  const categoryTotal: Category[] = Object.entries(categoryMap).map(
    ([name, total]) => ({ name, total }),
  );

  return { categoryTotal };
}
