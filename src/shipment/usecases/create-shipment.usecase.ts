import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { CreateShipmentDto } from '../dto/create-shipment.dto';

@Injectable()
export class CreateShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(data: CreateShipmentDto[]) {
    return this.shipmentRepository.createShipment(data);
  }
}
