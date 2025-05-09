import { Injectable } from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';

@Injectable()
export class FindIdMailMailUseCase {
  constructor(private readonly mailRepository: MailRepository) {}

  async execute(id: number) {
    return this.mailRepository.findIdMail(id);
  }
}
