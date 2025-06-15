import { Injectable } from '@nestjs/common';
import { FilterDashboardDto } from '../dto/filter-dashboard.dto';
import { UpdateDashboardDto } from '../dto/update-dashboard.dto';
import { FindFilterDashboardUseCase } from '../usecases/find-filter-dashboard.usecase';
import { totalInvoiceCountValueShipping } from '../utils/totalInvoiceCountValueShipping';
import { invoiceDispatchedDate } from '../utils/invoiceDispatchedDate';
import { totalCategory } from '../utils/totalCategory';
import { invoiceUFTotal } from '../utils/invoiceUFTotal';
import { invoiceCityTotal } from '../utils/invoiceCityTotal';
import { invoiceTransportTotal } from '../utils/invoiceTransportTotal';
import { invoiceTotal3Days } from '../utils/invoiceTotal3Days';
import { invoiceTransportValue } from '../utils/invoiceTransportValue';
import { shippingTime } from '../utils/shippingTime';

@Injectable()
export class DashboardService {
  constructor(
    private readonly findFilterDashboardUseCase: FindFilterDashboardUseCase,
  ) {}
  async getDashboardData(data: FilterDashboardDto) {
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
  }
}
