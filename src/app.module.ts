import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, ShipmentModule],
  providers: [PrismaService],
  exports: [],
})
export class AppModule {}
