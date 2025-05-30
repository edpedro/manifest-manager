import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';

@Injectable()
export class ListAllInvoicesShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(data: string[]) {
    return this.shipmentRepository.invoicesAllShipment(data);
  }
}
