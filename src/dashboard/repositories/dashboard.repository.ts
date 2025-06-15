import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterDashboardDto } from '../dto/filter-dashboard.dto';

const months: Record<string, number> = {
  Janeiro: 1,
  Fevereiro: 2,
  Março: 3,
  Abril: 4,
  Maio: 5,
  Junho: 6,
  Julho: 7,
  Agosto: 8,
  Setembro: 9,
  Outubro: 10,
  Novembro: 11,
  Dezembro: 12,
};

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFilterAllShipmentDashboard(data: FilterDashboardDto): Promise<any> {
    function getIntervaloDoMes(monthNew: string, year: number) {
      const month = months[monthNew];
      if (!month) throw new Error('Mês inválido');

      const dataMonthStart = new Date(year, month - 1, 1, 0, 0, 0);

      dataMonthStart.setHours(dataMonthStart.getHours() + 3);

      const dataMonthEnd = new Date(year, month, 0, 23, 59, 59, 999);

      dataMonthEnd.setHours(dataMonthEnd.getHours() + 3);

      return { dataMonthStart, dataMonthEnd };
    }

    function converterDataParaISOComFuso(
      dataString: string,
      finalDoDia = false,
    ): Date {
      const data = new Date(dataString);

      if (finalDoDia) {
        data.setHours(23, 59, 59, 999);
      } else {
        data.setHours(0, 0, 0, 0);
      }

      data.setHours(data.getHours() + 3);

      return data;
    }

    const intervaloMes = data.month
      ? getIntervaloDoMes(data.month, 2025)
      : undefined;

    const dataMonthStart = intervaloMes?.dataMonthStart;
    const dataMonthEnd = intervaloMes?.dataMonthEnd;

    const date_start = data.dateStart
      ? converterDataParaISOComFuso(data.dateStart)
      : undefined;

    const date_end = data.dateEnd
      ? converterDataParaISOComFuso(data.dateEnd, true)
      : undefined;

    const where: any = {};

    if (data.category) where.category = data.category;
    if (data.status) where.status = data.status;
    if (data.transport_mode) where.transport_mode = data.transport_mode;
    if (data.transport_mode_carrier)
      where.carrier = data.transport_mode_carrier;
    if (data.city) where.city = data.city;
    if (data.transportEnd) where.transport = data.transportEnd;

    if (dataMonthStart && dataMonthEnd) {
      where.invoice_issue_date = {
        gte: dataMonthStart,
        lte: dataMonthEnd,
      };
    } else if (date_start && date_end) {
      where.invoice_issue_date = {
        gte: date_start,
        lte: date_end,
      };
    }

    return this.prisma.shipment.findMany({ where });
  }
}
