import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';

@Injectable()
export class FindAllShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(userId: string) {
    return this.shippingRepository.findAllShipping(userId);
  }
}
