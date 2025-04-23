import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class UpdateSTShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(
    stExits: string,
    newST: string,
    userId: string,
  ): Promise<ShipmentDto[]> {
    return this.shipmentRepository.updateSTShipment(stExits, newST, userId);
  }
}
