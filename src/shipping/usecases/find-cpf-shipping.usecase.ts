import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';

@Injectable()
export class FindCPFShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(cpf: string) {
    return this.shippingRepository.findByCPF(cpf);
  }
}
