import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class ListIdShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(id: number): Promise<ShipmentDto> {
    return this.shipmentRepository.findIdShipment(id);
  }
}
