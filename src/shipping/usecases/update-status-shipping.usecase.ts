import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';
import { UpdateShippingDto } from '../dto/update-shipping.dto';

@Injectable()
export class UpdateStatusShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(id: number, updateShippingDto: UpdateShippingDto) {
    return this.shippingRepository.updateShippingStatus(id, updateShippingDto);
  }
}
