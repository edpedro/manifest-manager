import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class SearchStUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(st: string): Promise<ShipmentDto[]> {
    return this.shipmentRepository.searchStShipment(st);
  }
}
