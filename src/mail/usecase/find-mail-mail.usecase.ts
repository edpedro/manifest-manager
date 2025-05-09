import { Injectable } from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';

@Injectable()
export class FindEMailMailUseCase {
  constructor(private readonly mailRepository: MailRepository) {}

  async execute(mail: string) {
    return this.mailRepository.findMail(mail);
  }
}
