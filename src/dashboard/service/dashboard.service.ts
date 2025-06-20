import { Injectable } from '@nestjs/common';
import { FilterDashboardDto } from '../dto/filter-dashboard.dto';
import { UpdateDashboardDto } from '../dto/update-dashboard.dto';
import { FindFilterDashboardUseCase } from '../usecases/find-filter-dashboard.usecase';
import { totalInvoiceCountValueShipping } from '../utils/totalInvoiceCountValueShipping';
import {
  GroupedInvoiceData,
  invoiceDispatchedDate,
} from '../utils/invoiceDispatchedDate';
import { Category, totalCategory } from '../utils/totalCategory';
import { invoiceUFTotal, UF } from '../utils/invoiceUFTotal';
import { City, invoiceCityTotal } from '../utils/invoiceCityTotal';
import {
  invoiceTransportTotal,
  Transport,
} from '../utils/invoiceTransportTotal';
import { invoiceTotal3Days } from '../utils/invoiceTotal3Days';
import {
  invoiceTransportValue,
  TransportValue,
} from '../utils/invoiceTransportValue';
import { shippingTime, TimeShipping } from '../utils/shippingTime';
import { invoiceMediaDate } from '../utils/invoiceMediaDate';
import { Modal, totalModal } from '../utils/totalModal';
import { totalDriver } from '../utils/totalDriver';
import { ListAllShipmentUseCase } from 'src/shipment/usecases/list-all-shipment.usecase';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type DashboardData = {
  TotalSupply: number;
  TotalSt: number;
  SomaValeu: number;
  TotalExpedition: number;
  groupedInvoices: GroupedInvoiceData[];
  categoryTotal: Category[];
  top10InvoiceUfTotal: UF[];
  top10InvoiceCityTotal: City[];
  top10InvoiceTransportTotal: Transport[];
  invoiceTotal3: number;
  top5InvoiceTransportValueTotal: TransportValue[];
  timeShippinng: TimeShipping[];
  media: number;
  modalTotal: Modal[];
  driver: number;
};

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

@Injectable()
export class DashboardService {
  constructor(
    private readonly findFilterDashboardUseCase: FindFilterDashboardUseCase,
    private readonly listAllShipmentUseCase: ListAllShipmentUseCase,
  ) {}
  async getDashboardData(data: FilterDashboardDto): Promise<DashboardData> {
    const mesAtual = meses[new Date().getMonth()];

    if (!data) {
      data = { month: mesAtual };
    } else if (!data.month || data.month.trim() === '') {
      data.month = mesAtual;
    }

    const result = await this.findFilterDashboardUseCase.execute(data);

    const { TotalSupply, TotalSt, SomaValeu, TotalExpedition } =
      await totalInvoiceCountValueShipping(result);

    const { groupedInvoices } = await invoiceDispatchedDate(result);

    const { categoryTotal } = await totalCategory(result);

    const { top10InvoiceUfTotal } = await invoiceUFTotal(result);

    const { top10InvoiceCityTotal } = await invoiceCityTotal(result);

    const { top10InvoiceTransportTotal } = await invoiceTransportTotal(result);

    const { invoiceTotal3 } = await invoiceTotal3Days(result);

    const { top5InvoiceTransportValueTotal } =
      await invoiceTransportValue(result);

    const { timeShippinng } = await shippingTime(result);

    const { media } = await invoiceMediaDate(result);

    const { modalTotal } = await totalModal(result);

    const { driver } = await totalDriver(result);

    return {
      TotalSupply,
      TotalSt,
      SomaValeu,
      TotalExpedition,
      groupedInvoices,
      categoryTotal,
      top10InvoiceUfTotal,
      top10InvoiceCityTotal,
      top10InvoiceTransportTotal,
      invoiceTotal3,
      top5InvoiceTransportValueTotal,
      timeShippinng,
      media,
      modalTotal,
      driver,
    };
  }

  async filterAllDashboard() {
    const result = await this.listAllShipmentUseCase.execute();

    // for (const i of result) {
    //   if (i.transport) {
    //     const possuiEspaco = /\s+$/.test(i.transport);
    //     if (possuiEspaco) {
    //       console.log(`"${i.transport}"`);
    //       console.log('A string contém espaços.');
    //     }
    //   }
    // }

    const filterCardData = {
      month: [
        ...new Set(
          result
            .map((item) => item.invoice_issue_date)
            .filter((date) => !!date)
            .map(
              (date) =>
                new Date(date)
                  .toLocaleString('pt-BR', { month: 'long' })
                  .replace(/^./, (c) => c.toUpperCase()), // primeira letra maiúscula
            ),
        ),
      ],
      city: [...new Set(result.map((item) => item.city).filter(Boolean))],
      uf: [...new Set(result.map((item) => item.uf).filter(Boolean))],
      carrier: [...new Set(result.map((item) => item.carrier).filter(Boolean))],
      transport_mode: [
        ...new Set(result.map((item) => item.transport_mode).filter(Boolean)),
      ],
      category: [
        ...new Set(result.map((item) => item.category).filter(Boolean)),
      ],
      transport: [
        ...new Set(result.map((item) => item.transport).filter(Boolean)),
      ],
      status: [...new Set(result.map((item) => item.status).filter(Boolean))],
    };

    return filterCardData;
  }
}
