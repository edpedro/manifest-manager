import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class FindAllPendingInShippingShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(): Promise<ShipmentDto[]> {
    return this.shipmentRepository.allPendingInShipping();
  }
}
