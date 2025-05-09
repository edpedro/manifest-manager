import { Injectable } from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';
import { UpdateMailDto } from '../dto/update-mail.dto';

@Injectable()
export class UpdateMailUseCase {
  constructor(private readonly mailRepository: MailRepository) {}

  async execute(id: number, data: UpdateMailDto) {
    return this.mailRepository.updateMail(id, data);
  }
}
