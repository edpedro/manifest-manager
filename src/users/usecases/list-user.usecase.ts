import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserDto[]> {
    return this.userRepository.findAllUsers();
  }
}
