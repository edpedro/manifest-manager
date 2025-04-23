import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class DeleteShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(id: number) {
    return this.shipmentRepository.deleteByIdShipment(id);
  }
}
