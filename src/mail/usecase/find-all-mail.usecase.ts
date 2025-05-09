import { Injectable } from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';

@Injectable()
export class FindAllMailMailUseCase {
  constructor(private readonly mailRepository: MailRepository) {}

  async execute() {
    return this.mailRepository.findAllMail();
  }
}
