import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';

@Injectable()
export class RemoveShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(id: number) {
    return this.shippingRepository.removeShipping(id);
  }
}
