import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ShipmentModule } from './shipment/shipment.module';
import { ShippingModule } from './shipping/shipping.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, ShipmentModule, ShippingModule, MailModule],
  providers: [PrismaService],
  exports: [],
})
export class AppModule {}
