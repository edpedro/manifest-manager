import { UserDto } from '../dto/user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UpdatePasswordUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, hashedPassword: string): Promise<UserDto> {
    return this.userRepository.updatePassword(id, hashedPassword);
  }
}
