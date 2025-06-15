import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export type TimeShipping = {
  hora: string;
  total: number;
};

export async function shippingTime(
  data: ShipmentDto[],
): Promise<{ timeShippinng: TimeShipping[] }> {
  function horaToMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  function getFaixaHora(minutos: number): string | null {
    if (minutos >= 960 && minutos < 1080) return '16:00';
    if (minutos >= 840 && minutos < 960) return '14:00';
    if (minutos >= 720 && minutos < 840) return '12:00';
    if (minutos >= 600 && minutos < 720) return '10:00';
    if (minutos >= 480 && minutos < 600) return '08:00';
    return null;
  }

  const contagem: Record<string, number> = {};

  for (const item of data) {
    if (item.dispatch_time) {
      const minutos = horaToMinutos(item.dispatch_time);
      const faixa = getFaixaHora(minutos);
      if (faixa) {
        contagem[faixa] = (contagem[faixa] || 0) + 1;
      }
    }
  }

  const timeShippinng = Object.entries(contagem).map(([hora, total]) => ({
    hora,
    total,
  }));

  return { timeShippinng };
}
