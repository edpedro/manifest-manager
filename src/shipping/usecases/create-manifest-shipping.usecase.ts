import { Injectable } from '@nestjs/common';
import { ShippingRepository } from '../repositories/shippingRepository';
import { CreateManifestDto } from '../dto/create-manifest.dto';

@Injectable()
export class CreateManifestShippingUseCase {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async execute(data: CreateManifestDto) {
    return this.shippingRepository.createManifest(data);
  }
}
