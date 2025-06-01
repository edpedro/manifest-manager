import { Module } from '@nestjs/common';
import { DashboardService } from './service/dashboard.service';
import { DashboardController } from './controller/dashboard.controller';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
