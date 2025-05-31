import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';
import { UpdateManifestDto } from '../dto/update-manifest.dto';

@Injectable()
export class DeleteAllManifestShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(id: number) {
    return this.shippingRepository.deleteAllShipmentManifest(id);
  }
}
