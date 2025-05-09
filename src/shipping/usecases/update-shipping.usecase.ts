import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';
import { UpdateShippingDto } from '../dto/update-shipping.dto';

@Injectable()
export class UpdateShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(id: number, data: UpdateShippingDto) {
    return this.shippingRepository.updateShipping(id, data);
  }
}
