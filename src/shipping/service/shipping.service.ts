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
import { FindCPFShippingUseCase } from '../usecases/find-cpf-shipping.usecase';

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
    private readonly findCPFShippingUseCase: FindCPFShippingUseCase,
  ) {}

  async create(createShippingDto: CreateShippingDto, req: ReqUserDto) {
    const cpfExists = await this.findCPFShippingUseCase.execute(
      createShippingDto.cpf,
    );

    if (cpfExists) {
      if (cpfExists?.name !== createShippingDto.name.toUpperCase()) {
        throw new HttpException(
          'Inconsistência nos dados: o CPF informado está vinculado a um nome diferente do fornecido.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    function validateDate(dispatchDateString: string) {
      const now = new Date();

      const dispatchDate = new Date(dispatchDateString);

      const timeZone = 'America/Sao_Paulo';

      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const todayStr = formatter.format(now);
      const dispatchStr = formatter.format(dispatchDate);

      function parsePtBrDate(str: string) {
        const [dia, mes, ano] = str.split('/');
        return new Date(`${ano}-${mes}-${dia}T00:00:00`);
      }

      const todayDate = parsePtBrDate(todayStr);
      const dispatchClean = parsePtBrDate(dispatchStr);

      const diffMs = dispatchClean.getTime() - todayDate.getTime();

      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays < -1 || diffDays > 1) {
        throw new HttpException(
          'A data só pode ser até 1 dia antes ou 1 dia depois da data atual',
          HttpStatus.BAD_REQUEST,
        );
      }

      return true;
    }

    validateDate(createShippingDto.dispatch_date);
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

    const now = new Date();

    const timeZone = 'America/Sao_Paulo';

    const result = await this.findAllShippingUseCase.execute(driverId);

    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const data = result.filter((item) => {
      if (item.status === 'Expedido') {
        return formatter.format(item.dispatch_date) === formatter.format(now);
      } else if (item.status === 'Conferência' || item.status === 'Pendente') {
        return true;
      }
      return false;
    });

    return data;
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

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

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

    if (result.shipmentShipping.length > 0) {
      throw new HttpException(
        'Não pode ser deletado, há notas fiscais vinculadas.',
        HttpStatus.BAD_REQUEST,
      );
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

    if (shippingExists?.status === 'Expedido') {
      throw new HttpException(
        'Nota fiscal não pode ser incluida, Romaneio já foi expedido',
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
        'Não pode ser atualziada, Romaneio já foi expedido',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (result.shipmentShipping.length === 0) {
      throw new HttpException(
        'Não pode ser atualizada, há notas fiscais vinculadas.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateShippingDto.dispatch_date) {
      function validateDate(dispatchDateString: string) {
        const now = new Date();

        const dispatchDate = new Date(dispatchDateString);

        const timeZone = 'America/Sao_Paulo';

        const formatter = new Intl.DateTimeFormat('pt-BR', {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        const todayStr = formatter.format(now);
        const dispatchStr = formatter.format(dispatchDate);

        function parsePtBrDate(str: string) {
          const [dia, mes, ano] = str.split('/');
          return new Date(`${ano}-${mes}-${dia}T00:00:00`);
        }

        const todayDate = parsePtBrDate(todayStr);
        const dispatchClean = parsePtBrDate(dispatchStr);

        const diffMs = dispatchClean.getTime() - todayDate.getTime();

        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < -1 || diffDays > 1) {
          throw new HttpException(
            'A data só pode ser até 1 dia antes ou 1 dia depois da data atual',
            HttpStatus.BAD_REQUEST,
          );
        }

        return true;
      }
      validateDate(updateShippingDto.dispatch_date);
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

    if (shippingExists.shipmentShipping.length === 0) {
      throw new HttpException(
        'Não pode ser atualizada, há notas fiscais vinculadas.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.dispatch_date) {
      function validateDate(dispatchDateString: string) {
        const now = new Date();

        const dispatchDate = new Date(dispatchDateString);

        const timeZone = 'America/Sao_Paulo';

        const formatter = new Intl.DateTimeFormat('pt-BR', {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        const todayStr = formatter.format(now);
        const dispatchStr = formatter.format(dispatchDate);

        function parsePtBrDate(str: string) {
          const [dia, mes, ano] = str.split('/');
          return new Date(`${ano}-${mes}-${dia}T00:00:00`);
        }

        const todayDate = parsePtBrDate(todayStr);
        const dispatchClean = parsePtBrDate(dispatchStr);

        const diffMs = dispatchClean.getTime() - todayDate.getTime();

        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < -1 || diffDays > 1) {
          throw new HttpException(
            'A data só pode ser até 1 dia antes ou 1 dia depois da data atual',
            HttpStatus.BAD_REQUEST,
          );
        }

        return true;
      }

      validateDate(data.dispatch_date);
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
