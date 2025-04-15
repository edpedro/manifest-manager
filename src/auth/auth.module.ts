import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStarty } from './strategy/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ListUserUserNameUseCase } from 'src/users/usecases/list-user-username.usercase';
import { LocalStrategy } from './strategy/local.strategy';
import { ListUserIdUseCase } from 'src/users/usecases/list-user-id.usecase';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      privateKey: process.env.SECRET_KEY,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStarty,
    PrismaService,
    UserRepository,
    ListUserUserNameUseCase,
    ListUserIdUseCase,
  ],
  exports: [JwtModule, ListUserIdUseCase],
})
export class AuthModule {}
