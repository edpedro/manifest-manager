import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';
import { UpdateShippingDto } from '../dto/update-shipping.dto';

@Injectable()
export class UpdateExpeditionShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(id: number, data: UpdateShippingDto) {
    return this.shippingRepository.updateShippingStatus(id, data);
  }
}
