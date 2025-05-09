import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';
import { CreateManifestDto } from '../dto/create-manifest.dto';

@Injectable()
export class ListManifestShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(id: number[]) {
    return this.shippingRepository.findByIdsShipmentShipping(id);
  }
}
