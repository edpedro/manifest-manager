import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DashboardService } from '../service/dashboard.service';
import { FilterDashboardDto } from '../dto/filter-dashboard.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post()
  dashboardData(@Body() filterDashboardDto: FilterDashboardDto) {
    return this.dashboardService.getDashboardData(filterDashboardDto);
  }
}
