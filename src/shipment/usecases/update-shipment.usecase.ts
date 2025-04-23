import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class UpdateShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(
    id: number,
    data: UpdateShipmentDto,
    userId: string,
  ): Promise<ShipmentDto> {
    return this.shipmentRepository.updateShipment(id, data, userId);
  }
}
