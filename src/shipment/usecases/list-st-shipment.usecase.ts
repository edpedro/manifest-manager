import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class ListSTUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(st: string): Promise<ShipmentDto | null> {
    return this.shipmentRepository.findIdSTShipment(st);
  }
}
