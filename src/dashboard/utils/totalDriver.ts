import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export async function totalDriver(data: ShipmentDto[]) {
  let driver: number = 0;

  const removeDuplicatesName = Array.from(new Set(data.map((d) => d.name))).map(
    (name) => {
      return data.find((value) => value.name === name);
    },
  );

  removeDuplicatesName.forEach((item) => {
    if (item?.name) {
      driver = driver + 1;
    }
  });

  return {
    driver,
  };
}
