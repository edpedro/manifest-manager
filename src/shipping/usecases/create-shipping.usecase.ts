import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';
import { CreateShippingDto } from '../dto/create-shipping.dto';

@Injectable()
export class CreateShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(data: CreateShippingDto, userId: string) {
    return this.shippingRepository.createShipping(data, userId);
  }
}
