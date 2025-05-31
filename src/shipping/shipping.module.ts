import { Module } from '@nestjs/common';
import { ShippingService } from './service/shipping.service';
import { ShippingController } from './controller/shipping.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShippingRepository } from './repositories/shippingRepository';
import { CreateShippingUseCase } from './usecases/create-shipping.usecase';
import { FindAllShippingUseCase } from './usecases/find-all-shipping.usecase';
import { FindIdShippingUseCase } from './usecases/find-id-shipping.usecase';
import { UpdateShippingUseCase } from './usecases/update-shipping.usecase';
import { RemoveShippingUseCase } from './usecases/remove-shipping.usecase';
import { CreateManifestShippingUseCase } from './usecases/create-manifest-shipping.usecase';
import { ListIdSShipmentUseCase } from 'src/shipment/usecases/list-ids-shipment.usecase';
import { ShipmentRepository } from 'src/shipment/repositories/shipment.repository';
import { ListManifestShippingUseCase } from './usecases/list-manifest-shipping.usecase';
import { DeleteManifestShippingUseCase } from './usecases/delete-manifest-shipping.usecase';
import { ListIdShipmentUseCase } from 'src/shipment/usecases/list-id-shipment.usecase';
import { UpdateStatusShippingUseCase } from './usecases/update-status-shipping.usecase';
import { UpdateStatusMailShippingUseCase } from './usecases/update-statusMail-shipping.usecase';
import { UpdateExpeditionShippingUseCase } from './usecases/update-expedition-shipping.usecase';
import { FindCPFShippingUseCase } from './usecases/find-cpf-shipping.usecase';
import { DeleteAllManifestShippingUseCase } from './usecases/delete-Allmanifest-shipping.usecase';

@Module({
  controllers: [ShippingController],
  providers: [
    ShippingService,
    PrismaService,
    ShippingRepository,
    ShipmentRepository,
    CreateShippingUseCase,
    FindAllShippingUseCase,
    FindIdShippingUseCase,
    UpdateShippingUseCase,
    RemoveShippingUseCase,
    CreateManifestShippingUseCase,
    ListIdSShipmentUseCase,
    ListManifestShippingUseCase,
    DeleteManifestShippingUseCase,
    ListIdShipmentUseCase,
    UpdateStatusShippingUseCase,
    UpdateStatusMailShippingUseCase,
    UpdateExpeditionShippingUseCase,
    FindCPFShippingUseCase,
    DeleteAllManifestShippingUseCase,
  ],
})
export class ShippingModule {}
