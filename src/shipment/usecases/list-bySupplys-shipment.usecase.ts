import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';

@Injectable()
export class ListBySupplysShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(data: string) {
    return this.shipmentRepository.findBySupply(data);
  }
}
