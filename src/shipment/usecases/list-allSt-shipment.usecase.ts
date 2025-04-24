import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';

@Injectable()
export class ListAllStShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(data: string[]) {
    return this.shipmentRepository.sTsAllShipment(data);
  }
}
