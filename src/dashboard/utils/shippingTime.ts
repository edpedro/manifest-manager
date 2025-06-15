import { ShipmentDto } from 'src/shipment/dto/shipment.dto';

export async function shippingTime(data: ShipmentDto[]) {
  function horaToMinutos(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  function getFaixaHora(minutos) {
    if (minutos >= 960 && minutos < 1080) return '16:00'; // 16:00–17:59
    if (minutos >= 840 && minutos < 960) return '14:00'; // 14:00–15:59
    if (minutos >= 720 && minutos < 840) return '12:00'; // 12:00–13:59
    if (minutos >= 600 && minutos < 720) return '10:00'; // 10:00–11:59
    if (minutos >= 480 && minutos < 600) return '08:00'; // 08:00–09:59
    return null;
  }

  const contagem = {};

  for (const item of data) {
    if (item.status === 'Expedido') {
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
