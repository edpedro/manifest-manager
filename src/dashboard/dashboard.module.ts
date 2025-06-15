import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardRepository } from './repositories/dashboard.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindFilterDashboardUseCase } from './usecases/find-filter-dashboard.usecase';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardRepository,
    PrismaService,
    FindFilterDashboardUseCase,
  ],
})
export class DashboardModule {}
