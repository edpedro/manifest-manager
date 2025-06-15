import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export async function invoiceMediaDate(shipments: ShipmentDto[]) {
  let totalDia = 0;
  let totalNF = 0;

  function formatarDataParaComparacao(data) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  }
  for (const shipment of shipments) {
    if (shipment.dispatch_date) {
      const data1 = formatarDataParaComparacao(
        new Date(shipment.invoice_issue_date),
      );
      const data2 = formatarDataParaComparacao(
        new Date(shipment.dispatch_date),
      );

      totalDia += data2.getDate() - data1.getDate();
      totalNF += 1;
    }
  }

  const media = totalDia / totalNF;

  return { media };
}
