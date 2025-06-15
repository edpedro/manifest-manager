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
  ) {}
  async getDashboardData(data: FilterDashboardDto): Promise<DashboardData> {
    const mesAtual = meses[new Date().getMonth()];

    if (data.month === '') {
      data.month = mesAtual;
    }
    console.log(data.month);
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
    };
  }
}
