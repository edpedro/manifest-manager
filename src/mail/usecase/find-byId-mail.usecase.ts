import { Injectable } from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';

@Injectable()
export class FindByIdMailMailUseCase {
  constructor(private readonly mailRepository: MailRepository) {}

  async execute(id: number) {
    return this.mailRepository.findById(id);
  }
}
