import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';

@Injectable()
export class DeleteManifestShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(shipmentId: number, shippingId: number) {
    return this.shippingRepository.deleteShipmentShipping(
      shipmentId,
      shippingId,
    );
  }
}
