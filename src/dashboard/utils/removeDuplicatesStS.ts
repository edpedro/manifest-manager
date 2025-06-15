import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export async function RemoveDuplicatesStS(data: ShipmentDto[]) {
  const removeDuplicatesStS = Array.from(new Set(data.map((d) => d.st))).map(
    (st) => {
      return data.find((value) => value.st === st);
    },
  );

  return removeDuplicatesStS;
}
