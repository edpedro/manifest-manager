import { Module } from '@nestjs/common';
import { MailService } from './service/mail.service';
import { MailController } from './controller/mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindIdShippingUseCase } from 'src/shipping/usecases/find-id-shipping.usecase';
import { ShippingRepository } from 'src/shipping/repositories/shippingRepository';
import { EmailQueueService } from './Queue/EmailQueueService';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailRepository } from './repositories/mail.repository';
import { FindAllMailMailUseCase } from './usecase/find-all-mail.usecase';
import { CreateMailUseCase } from './usecase/create-mail.usecase';
import { DeleteMailUseCase } from './usecase/delete-mail.usecase';
import { UpdateMailUseCase } from './usecase/update-mail.usecase';
import { FindEMailMailUseCase } from './usecase/find-mail-mail.usecase';
import { FindIdMailMailUseCase } from './usecase/find-id-mail.usecase';
import { UpdateStatusMailShippingUseCase } from 'src/shipping/usecases/update-statusMail-shipping.usecase';
import { FindByIdMailMailUseCase } from './usecase/find-byId-mail.usecase';

@Module({
  imports: [
    ConfigModule.forRoot(), // Adicione esta linha
    MailerModule.forRootAsync({
      // Mude para forRootAsync
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get<string>('EMAIL_FROM_NAME')}" <${configService.get<string>('EMAIL_FROM_ADDRESS')}>`,
        },
        template: {
          dir: join(process.cwd(), 'src', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [
    MailService,
    PrismaService,
    MailRepository,
    ShippingRepository,
    FindIdShippingUseCase,
    EmailQueueService,
    CreateMailUseCase,
    FindAllMailMailUseCase,
    FindEMailMailUseCase,
    DeleteMailUseCase,
    UpdateMailUseCase,
    FindIdMailMailUseCase,
    UpdateStatusMailShippingUseCase,
    FindByIdMailMailUseCase,
  ],
})
export class MailModule {}
