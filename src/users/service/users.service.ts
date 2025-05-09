import { ListUserUseCase } from './../usecases/list-user.usecase';
import { ListUserEmailUseCase } from './../usecases/list-user-email.usercase';
import { CreateUserUseCase } from './../usecases/create-user.usecase';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ListUserUserNameUseCase } from '../usecases/list-user-username.usercase';
import { EncryptedPassword } from 'src/users/utils/users/encrypted-password';
import { UpdateUserUseCase } from '../usecases/update-user.usecase';
import { DeleteUserUseCase } from '../usecases/delete-user.usecase';
import { ListUserIdUseCase } from '../usecases/list-user-id.usecase';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUserEmailUseCase: ListUserEmailUseCase,
    private readonly listUserUserNameUseCase: ListUserUserNameUseCase,
    private readonly listUserUseCase: ListUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUserIdUseCase: ListUserIdUseCase,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userEmailExist = await this.listUserEmailUseCase.execute(
      createUserDto.email,
    );

    if (userEmailExist) {
      throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST);
    }

    const userNameExist = await this.listUserUserNameUseCase.execute(
      createUserDto.username,
    );

    if (userNameExist) {
      throw new HttpException('Usuario já cadastrado', HttpStatus.BAD_REQUEST);
    }

    try {
      const data = await this.createUserUseCase.execute(createUserDto);

      return data;
    } catch (error) {
      throw new HttpException('Usuario não cadastrado', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    const users = await this.listUserUseCase.execute();
    return users;
  }

  async findOne(id: string) {
    const userEmailExist = await this.listUserIdUseCase.execute(id);

    if (!userEmailExist) {
      throw new HttpException('Usuario não encontrado', HttpStatus.BAD_REQUEST);
    }

    return userEmailExist;
  }

  async update(id: string, data: UpdateUserDto) {
    const userEmailExist = await this.listUserIdUseCase.execute(id);

    if (!userEmailExist) {
      throw new HttpException('Usuario não encontrado', HttpStatus.BAD_REQUEST);
    }

    try {
      const dataToUpdate: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        type: data.type,
        username: data.username,
      };

      if (data.password) {
        const hashedPassword = await EncryptedPassword(data.password);
        dataToUpdate.password = hashedPassword;
      }

      const user = await this.updateUserUseCase.execute(id, dataToUpdate);

      return user;
    } catch (error) {
      console.log(error.message);
      throw new HttpException('Usuario não atualizado', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const userEmailExist = await this.listUserIdUseCase.execute(id);

      if (!userEmailExist) {
        throw new HttpException(
          'Usuario não encontrado',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.deleteUserUseCase.execute(id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Usuario não deletado', HttpStatus.BAD_REQUEST);
    }
  }
}
