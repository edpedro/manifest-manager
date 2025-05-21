import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { ListUserEmailUseCase } from './usecases/list-user-email.usercase';
import { ListUserUserNameUseCase } from './usecases/list-user-username.usercase';
import { ListUserUseCase } from './usecases/list-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';
import { ListUserIdUseCase } from './usecases/list-user-id.usecase';
import { EmailQueueService } from 'src/mail/Queue/EmailQueueService';
import { UpdatePasswordUserUseCase } from './usecases/update-password.user.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UsersController],
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      privateKey: process.env.SECRET_KEY,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    UsersService,
    PrismaService,
    UserRepository,
    CreateUserUseCase,
    ListUserEmailUseCase,
    ListUserUserNameUseCase,
    ListUserUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    ListUserIdUseCase,
    EmailQueueService,
    UpdatePasswordUserUseCase,
  ],
})
export class UsersModule {}
