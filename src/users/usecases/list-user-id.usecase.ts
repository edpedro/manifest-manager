import { UserDto } from '../dto/user.dto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class ListUserIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserDto | null> {
    return this.userRepository.findByIdUser(id);
  }
}
