import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';
import { DateShipmentDto } from '../dto/date-shipment.dto';

@Injectable()
export class DateFindAllUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(date_start: string, date_end: string): Promise<ShipmentDto[]> {
    return this.shipmentRepository.findDateShipment(date_start, date_end);
  }
}
