import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMailDto } from '../dto/create-mail.dto';
import { MailDto } from '../dto/mail.dto';
import { UpdateMailDto } from '../dto/update-mail.dto';

@Injectable()
export class MailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createShipment(data: CreateMailDto): Promise<any> {
    return await this.prisma.mail.create({
      data,
    });
  }

  async findAllMail(): Promise<MailDto[]> {
    return await this.prisma.mail.findMany({});
  }

  async findMail(mail: string): Promise<any> {
    return await this.prisma.mail.findFirst({
      where: {
        email: mail,
      },
    });
  }

  async updateMail(id: number, data: UpdateMailDto): Promise<any> {
    return await this.prisma.mail.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteMail(id: number): Promise<any> {
    return await this.prisma.mail.delete({
      where: {
        id,
      },
    });
  }

  async findIdMail(id: number): Promise<any> {
    return await this.prisma.mail.findFirst({
      where: {
        id,
      },
    });
  }
}
