import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ShipmentModule } from './shipment/shipment.module';
import { ShippingModule } from './shipping/shipping.module';
import { MailModule } from './mail/mail.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ShipmentModule,
    ShippingModule,
    MailModule,
    DashboardModule,
  ],
  providers: [PrismaService],
  exports: [],
})
export class AppModule {}
