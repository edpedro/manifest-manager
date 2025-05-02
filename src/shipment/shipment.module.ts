import { Module } from '@nestjs/common';
import { ShipmentService } from './service/shipment.service';
import { ShipmentController } from './controller/shipment.controller';
import { ShipmentRepository } from './repositories/shipment.repository';
import { CreateShipmentUseCase } from './usecases/create-shipment.usecase';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListAllSupplysShipmentUseCase } from './usecases/list-allSupplys-shipment.usecase';
import { ListIdShipmentUseCase } from './usecases/list-id-shipment.usecase';
import { ListAllShipmentUseCase } from './usecases/list-all-shipment.usecase';
import { UpdateShipmentUseCase } from './usecases/update-shipment.usecase';
import { ListSTUseCase } from './usecases/list-st-shipment.usecase';
import { UpdateSTShipmentUseCase } from './usecases/update-st-shipment.usecase';
import { DeleteShipmentUseCase } from './usecases/deletar-shipment.usecase';
import { ListUserIdUseCase } from 'src/users/usecases/list-user-id.usecase';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { SearchStUseCase } from './usecases/st-search-shipment.usecase';
import { SearchInvoiceUseCase } from './usecases/invoice-search-shipment.usecase';
import { SearchSupplyUseCase } from './usecases/supply-search-shipment.usecase';
import { DateFindAllUseCase } from './usecases/date-all-shipment.usecase';
import { ListAllStShipmentUseCase } from './usecases/list-allSt-shipment.usecase';
import { ListBySupplysShipmentUseCase } from './usecases/list-bySupplys-shipment.usecase';
import { UpdateExpeditionShipmentUseCase } from './usecases/update-expedition-shipment.usecase';
import { FindAllSTSupplyNFShipmentUseCase } from './usecases/find-all-shipment.usecase';

@Module({
  controllers: [ShipmentController],
  providers: [
    ShipmentService,
    PrismaService,
    ShipmentRepository,
    UserRepository,
    CreateShipmentUseCase,
    ListAllSupplysShipmentUseCase,
    ListIdShipmentUseCase,
    ListAllShipmentUseCase,
    UpdateShipmentUseCase,
    ListSTUseCase,
    UpdateSTShipmentUseCase,
    DeleteShipmentUseCase,
    ListUserIdUseCase,
    SearchStUseCase,
    SearchInvoiceUseCase,
    SearchSupplyUseCase,
    DateFindAllUseCase,
    ListAllStShipmentUseCase,
    ListBySupplysShipmentUseCase,
    UpdateExpeditionShipmentUseCase,
    FindAllSTSupplyNFShipmentUseCase,
  ],
})
export class ShipmentModule {}
