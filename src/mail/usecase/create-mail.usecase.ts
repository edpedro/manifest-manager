import { Injectable } from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';
import { CreateMailDto } from '../dto/create-mail.dto';

@Injectable()
export class CreateMailUseCase {
  constructor(private readonly mailRepository: MailRepository) {}

  async execute(data: CreateMailDto) {
    return this.mailRepository.createShipment(data);
  }
}
