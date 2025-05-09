import { Injectable } from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';

@Injectable()
export class DeleteMailUseCase {
  constructor(private readonly mailRepository: MailRepository) {}

  async execute(id: number) {
    return this.mailRepository.deleteMail(id);
  }
}
