import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';
import { ReqUserDto } from 'src/auth/dto/req-user.dto';
import { CreateShippingUseCase } from '../usecases/create-shipping.usecase';
import { FindAllShippingUseCase } from '../usecases/find-all-shipping.usecase';
import { FindIdShippingUseCase } from '../usecases/find-id-shipping.usecase';
import { UpdateShippingUseCase } from '../usecases/update-shipping.usecase';
import { RemoveShippingUseCase } from '../usecases/remove-shipping.usecase';
import { CreateManifestDto } from '../dto/create-manifest.dto';
import { CreateManifestShippingUseCase } from '../usecases/create-manifest-shipping.usecase';
import { ListIdSShipmentUseCase } from 'src/shipment/usecases/list-ids-shipment.usecase';
import { ShipmentDto } from 'src/shipment/dto/shipment.dto';
import { ListManifestShippingUseCase } from '../usecases/list-manifest-shipping.usecase';
import { DeleteManifestShippingUseCase } from '../usecases/delete-manifest-shipping.usecase';
import { UpdateManifestDto } from '../dto/update-manifest.dto';
import { ListIdShipmentUseCase } from 'src/shipment/usecases/list-id-shipment.usecase';
import { UpdateStatusShippingUseCase } from '../usecases/update-status-shipping.usecase';
import { UpdateExpeditionShippingUseCase } from '../usecases/update-expedition-shipping.usecase';

@Injectable()
export class ShippingService {
  constructor(
    private readonly createShippingUseCase: CreateShippingUseCase,
    private readonly findAllShippingUseCase: FindAllShippingUseCase,
    private readonly findIdShippingUseCase: FindIdShippingUseCase,
    private readonly updateShippingUseCase: UpdateShippingUseCase,
    private readonly removeShippingUseCase: RemoveShippingUseCase,
    private readonly createManifestShippingUseCase: CreateManifestShippingUseCase,
    private readonly listIdSShipmentUseCase: ListIdSShipmentUseCase,
    private readonly listManifestShippingUseCase: ListManifestShippingUseCase,
    private readonly deleteManifestShippingUseCase: DeleteManifestShippingUseCase,
    private readonly listIdShipmentUseCase: ListIdShipmentUseCase,
    private readonly updateStatusShippingUseCase: UpdateStatusShippingUseCase,
    private readonly updateExpeditionShippingUseCase: UpdateExpeditionShippingUseCase,
  ) {}

  async create(createShippingDto: CreateShippingDto, req: ReqUserDto) {
    try {
      const result = await this.createShippingUseCase.execute(
        createShippingDto,
        req.user.id,
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(req: ReqUserDto) {
    const driverId = req.user.type === 'driver' ? req.user.id : '';

    return await this.findAllShippingUseCase.execute(driverId);
  }

  async findOne(id: number, req: ReqUserDto) {
    const driverId = req.user.type === 'driver' ? req.user.id : '';

    const result = await this.findIdShippingUseCase.execute(id, driverId);

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  async update(id: number, updateShippingDto: UpdateShippingDto) {
    const result = await this.findIdShippingUseCase.execute(id);

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    if (result.status === 'Expedido') {
      throw new HttpException(
        'Não pode ser alterado, Romaneio já foi expedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.updateShippingUseCase.execute(
        id,
        updateShippingDto,
      );

      return result;
    } catch (error) {
      throw new HttpException('Dados não atualizado', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    const result = await this.findIdShippingUseCase.execute(id);

    if (result?.status === 'Expedido') {
      throw new HttpException(
        'Não pode ser deletado, Romaneio já foi expedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (result?.isConfirm === true) {
      throw new HttpException(
        'Não pode ser deletado, Romaneio já foi expedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.removeShippingUseCase.execute(id);
    } catch (error) {
      throw new HttpException('Dados não deletado', HttpStatus.BAD_REQUEST);
    }
  }

  async createManifest(data: CreateManifestDto, req: ReqUserDto) {
    const shippingExists = await this.findIdShippingUseCase.execute(
      data.shippingId,
    );

    if (!shippingExists) {
      throw new HttpException(
        'Romaneio não encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const shipmentExists = await this.listIdSShipmentUseCase.execute(
      data.shipmentId,
    );

    function filterDispatched(shipments: ShipmentDto[]) {
      const dispatched = shipments.filter((item) => item.status === 'Expedido');
      const notDispatched = shipments.filter(
        (item) => item.status !== 'Expedido',
      );

      return { dispatched, notDispatched };
    }

    const { dispatched, notDispatched } = filterDispatched(shipmentExists);

    if (dispatched.length > 0) {
      const dispatchedSupplies = dispatched
        .map((item) => item.supply)
        .join(', ');
      throw new HttpException(
        `Os seguintes fornecimentos já foram expedidos: ${dispatchedSupplies}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const idsShipment = notDispatched.map((item) => item.id);
    const shippingAlreadyExists =
      await this.listManifestShippingUseCase.execute(idsShipment);

    if (shippingAlreadyExists.length > 0) {
      const shipment = shippingAlreadyExists
        .map((item) => item.shipment.supply)
        .join(', ');
      throw new HttpException(
        `Os fornecimentos ${shipment} já constam no romaneio ${shippingAlreadyExists[0].shipping.id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newManifest: CreateManifestDto = {
      shipmentId: idsShipment,
      shippingId: data.shippingId,
    };

    try {
      return await this.createManifestShippingUseCase.execute(newManifest);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao criar romaneio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeManisfest(id: number, data: UpdateManifestDto) {
    const shippingExists = await this.findIdShippingUseCase.execute(id);

    if (!shippingExists) {
      throw new HttpException(
        'Romaneio não encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (shippingExists?.status === 'Expedido') {
      throw new HttpException(
        'Não pode ser deletado, Romaneio já foi expedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (shippingExists?.isConfirm === true) {
      throw new HttpException(
        'Não pode ser deletado, Romaneio já foi expedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const idShipment = data.shipmentId?.[0];

    if (idShipment === undefined) {
      throw new Error(
        'shipmentId é obrigatório e deve conter pelo menos um valor',
      );
    }

    const shipmentExist = await this.listIdShipmentUseCase.execute(idShipment);

    if (!shipmentExist) {
      throw new Error('Dados não encontrados');
    }

    try {
      await this.deleteManifestShippingUseCase.execute(idShipment, id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não deletado', HttpStatus.BAD_REQUEST);
    }
  }

  async updateStatus(id: number, updateShippingDto: UpdateShippingDto) {
    const result = await this.findIdShippingUseCase.execute(id);

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    if (!updateShippingDto.dispatch_time && !updateShippingDto.dispatch_date) {
      throw new HttpException(
        'O campo Dispatch Time deve ser obrigatório.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (result.status === 'Expedido') {
      throw new HttpException(
        'Não pode ser deletado, Romaneio já foi expedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.updateStatusShippingUseCase.execute(
        id,
        updateShippingDto,
      );

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não atualizado', HttpStatus.BAD_REQUEST);
    }
  }

  async confirmExpedition(id: number, data: UpdateShippingDto) {
    const shippingExists = await this.findIdShippingUseCase.execute(id);

    if (!shippingExists) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    if (data.dispatch_date && data.dispatch_time) {
      throw new HttpException(
        'Campos data e hora obrigatório',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.updateExpeditionShippingUseCase.execute(id, data);

      return { message: 'status atualizado' };
    } catch (error) {
      throw new HttpException(
        'Romaneio não atualziado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
