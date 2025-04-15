import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { EncryptedPassword } from 'src/users/utils/users/encrypted-password';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserAuthDto } from 'src/auth/dto/UserAuthDto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await EncryptedPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUserName(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        username: true,
      },
    });
  }

  async findByIdUser(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
      },
    });
  }

  async findAllUsers(): Promise<UserDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
      },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
