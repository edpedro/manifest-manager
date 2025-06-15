import { ShipmentDto, ShipmentPendingDto } from 'src/shipment/dto/shipment.dto';

export async function invoiceTotal3Days(data: ShipmentDto[]) {
  const now = new Date();
  const timeZone = 'America/Sao_Paulo';

  let invoiceTotal3: number = 0;

  data.map((invoice) => {
    const newPening: ShipmentPendingDto = { ...invoice };

    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const todayStr = formatter.format(now);

    function parsePtBrDate(str: string) {
      const [dia, mes, ano] = str.split('/');
      return new Date(`${ano}-${mes}-${dia}`);
    }

    function getDateOnly(date: Date): string {
      return date.toISOString().split('T')[0];
    }

    function calculateBusinessDays(startDate: Date, endDate: Date): number {
      let businessDays = 0;
      const current = new Date(startDate);

      const isNegative = endDate < startDate;
      const [fromDate, toDate] = isNegative
        ? [endDate, startDate]
        : [startDate, endDate];

      current.setTime(fromDate.getTime());

      while (current < toDate) {
        const dayOfWeek = current.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          businessDays++;
        }

        current.setDate(current.getDate() + 1);
      }

      return isNegative ? -businessDays : businessDays;
    }

    const todayDate = parsePtBrDate(todayStr);
    const dispatchDateStr = getDateOnly(invoice.invoice_issue_date);
    const dispatchClean = new Date(dispatchDateStr);

    const diffBusinessDays = calculateBusinessDays(todayDate, dispatchClean);

    if (
      (diffBusinessDays <= -3 && newPening.status === 'Pendente') ||
      newPening.status === 'Em romaneio'
    ) {
      invoiceTotal3 += 1;
    }

    return newPening;
  });

  return { invoiceTotal3 };
}
