import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class ListIdSShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(ids: number[]): Promise<ShipmentDto[]> {
    return this.shipmentRepository.findIdsShipment(ids);
  }
}
