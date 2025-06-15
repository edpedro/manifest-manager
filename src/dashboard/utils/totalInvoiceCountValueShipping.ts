import { ShipmentDto } from 'src/shipment/dto/shipment.dto';
import { RemoveDuplicatesStS } from './removeDuplicatesStS';

export async function totalInvoiceCountValueShipping(data: ShipmentDto[]) {
  let TotalSupply: number = 0;
  let TotalSt: number = 0;
  let SomaValeu: number = 0;
  let TotalExpedition: number = 0;

  data.forEach((item) => {
    if (item.supply !== null && item.status === 'Expedido') {
      TotalExpedition = TotalExpedition + 1;
    }
    if (item.supply !== null) {
      TotalSupply = TotalSupply + 1;
    }
    if (item.Valeu_invoice !== null) {
      SomaValeu += item.Valeu_invoice;
    }
  });

  const remove = await RemoveDuplicatesStS(data);

  remove.forEach((item) => {
    if (item?.st !== null) {
      TotalSt = TotalSt + 1;
    }
  });

  return {
    TotalSupply,
    TotalSt,
    SomaValeu,
    TotalExpedition,
  };
}
