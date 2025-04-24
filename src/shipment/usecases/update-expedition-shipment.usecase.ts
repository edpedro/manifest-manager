import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class UpdateExpeditionShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(
    id: number,
    data: UpdateShipmentDto,
    userId: string,
  ): Promise<any> {
    return this.shipmentRepository.updateExpedition(id, data, userId);
  }
}
