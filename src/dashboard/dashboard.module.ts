import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardRepository } from './repositories/dashboard.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindFilterDashboardUseCase } from './usecases/find-filter-dashboard.usecase';
import { ListAllShipmentUseCase } from 'src/shipment/usecases/list-all-shipment.usecase';
import { ShipmentRepository } from 'src/shipment/repositories/shipment.repository';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardRepository,
    ShipmentRepository,
    PrismaService,
    FindFilterDashboardUseCase,
    ListAllShipmentUseCase,
  ],
})
export class DashboardModule {}
