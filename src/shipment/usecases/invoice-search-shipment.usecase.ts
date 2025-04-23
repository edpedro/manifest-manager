import { Injectable } from '@nestjs/common';
import { ShipmentRepository } from '../repositories/shipment.repository';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class SearchInvoiceUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  async execute(invoice: string): Promise<ShipmentDto[]> {
    return this.shipmentRepository.searchInvoiceShipment(invoice);
  }
}
