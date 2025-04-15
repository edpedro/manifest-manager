import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListUserUserNameUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(usename: string) {
    return this.userRepository.findByUserName(usename);
  }
}
