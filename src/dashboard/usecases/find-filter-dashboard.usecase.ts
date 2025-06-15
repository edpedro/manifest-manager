import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { FilterDashboardDto } from '../dto/filter-dashboard.dto';

@Injectable()
export class FindFilterDashboardUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(data: FilterDashboardDto) {
    return this.dashboardRepository.findFilterAllShipmentDashboard(data);
  }
}
