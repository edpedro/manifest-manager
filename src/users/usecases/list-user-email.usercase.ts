import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from './../repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListUserEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
