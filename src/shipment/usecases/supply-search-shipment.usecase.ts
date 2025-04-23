import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class SearchSupplyUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(supply: string): Promise<ShipmentDto[]> {
    return this.shipmentRepository.searchSupplyShipment(supply);
  }
}
