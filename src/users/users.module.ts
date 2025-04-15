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

@Module({
  controllers: [UsersController],
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
  ],
})
export class UsersModule {}
