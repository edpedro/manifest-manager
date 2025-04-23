import { CreateShipmentUseCase } from './../usecases/create-shipment.usecase';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { UploadDto } from 'src/upload/file-upload.dto';
import { ReqUserDto } from 'src/auth/dto/req-user.dto';
import { createExcelManager } from '../utils/createExcelManager';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { ListAllSupplysShipmentUseCase } from '../usecases/list-allSupplys-shipment.usecase';
import { ListIdShipmentUseCase } from '../usecases/list-id-shipment.usecase';
import { ListAllShipmentUseCase } from '../usecases/list-all-shipment.usecase';
import { UpdateShipmentUseCase } from '../usecases/update-shipment.usecase';
import { ListSTUseCase } from '../usecases/list-st-shipment.usecase';
import { UpdateSTShipmentUseCase } from '../usecases/update-st-shipment.usecase';
import { DeleteShipmentUseCase } from '../usecases/deletar-shipment.usecase';
import { ListUserIdUseCase } from 'src/users/usecases/list-user-id.usecase';
import { SearchStUseCase } from '../usecases/st-search-shipment.usecase';
import { ShipmentDto } from '../dto/shipment.dto';
import { SearchInvoiceUseCase } from '../usecases/invoice-search-shipment.usecase';
import { SearchSupplyUseCase } from '../usecases/supply-search-shipment.usecase';

@Injectable()
export class ShipmentService {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly listAllSupplysShipmentUseCase: ListAllSupplysShipmentUseCase,
    private readonly listIdShipmentUseCase: ListIdShipmentUseCase,
    private readonly listAllShipmentUseCase: ListAllShipmentUseCase,
    private readonly updateShipmentUseCase: UpdateShipmentUseCase,
    private readonly listSTUseCase: ListSTUseCase,
    private readonly updateSTShipmentUseCase: UpdateSTShipmentUseCase,
    private readonly deleteShipmentUseCase: DeleteShipmentUseCase,
    private readonly listUserIdUseCase: ListUserIdUseCase,
    private readonly searchStUseCase: SearchStUseCase,
    private readonly searchInvoiceUseCase: SearchInvoiceUseCase,
    private readonly searchSupplyUseCase: SearchSupplyUseCase,
  ) {}
  async create(file: UploadDto, req: ReqUserDto) {
    const dataExcel = await createExcelManager(file, req.user.id);

    const supplys = dataExcel.map((supply) => supply.supply);

    const result = await this.listAllSupplysShipmentUseCase.execute(supplys);

    let dataCreate: CreateShipmentDto[] = [];
    let dataError: CreateShipmentDto[] = [];

    if (result.length > 0) {
      const idsRemover = new Set(result.map((item) => item.supply));

      const isRemover = dataExcel.filter(
        (item) => !idsRemover.has(item.supply),
      );
      dataCreate.push(...isRemover);
      dataError.push(...result);
    } else {
      const idsRemover = new Set(dataError.map((item) => item.supply));

      const result = dataExcel.filter((item) => !idsRemover.has(item.supply));

      dataCreate.push(...result);
    }

    try {
      await this.createShipmentUseCase.execute(dataCreate);

      return { dataCreate, dataError };
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não cadastrados', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.listAllShipmentUseCase.execute();
  }

  async findOne(id: number) {
    const data = await this.listIdShipmentUseCase.execute(id);

    if (!data) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return data;
  }

  async search(searchData: UpdateShipmentDto, req: ReqUserDto) {
    const data: ShipmentDto[] = [];

    if (searchData.st) {
      const stExist = await this.searchStUseCase.execute(searchData.st);

      data.push(...stExist);
    }

    if (searchData.invoice_number) {
      const invoiceExist = await this.searchInvoiceUseCase.execute(
        searchData.invoice_number,
      );

      data.push(...invoiceExist);
    }

    if (searchData.supply) {
      const supplyExist = await this.searchSupplyUseCase.execute(
        searchData.supply,
      );

      data.push(...supplyExist);
    }

    return data;
  }

  async update(
    id: number,
    updateShipmentDto: UpdateShipmentDto,
    req: ReqUserDto,
  ) {
    const data = await this.listIdShipmentUseCase.execute(id);

    if (!data) {
      throw new HttpException('Dados não encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      const update = await this.updateShipmentUseCase.execute(
        id,
        updateShipmentDto,
        req.user.id,
      );

      return update;
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não atualizado', HttpStatus.BAD_REQUEST);
    }
  }

  async updateAllST(
    id: number,
    updateShipmentDto: UpdateShipmentDto,
    req: ReqUserDto,
  ) {
    const stExist = await this.listIdShipmentUseCase.execute(id);

    if (!stExist) {
      throw new HttpException('Dados não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!updateShipmentDto.st) {
      throw new HttpException('Campo vazio', HttpStatus.NOT_FOUND);
    }
    const data = await this.listSTUseCase.execute(updateShipmentDto.st);

    if (data) {
      throw new HttpException('ST já existe', HttpStatus.NOT_FOUND);
    }

    try {
      const update = await this.updateSTShipmentUseCase.execute(
        stExist.st,
        updateShipmentDto.st,
        req.user.id,
      );
      return update;
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não atualizado', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number, req: ReqUserDto) {
    const exist = await this.listIdShipmentUseCase.execute(id);

    if (!exist) {
      throw new HttpException('Dados não encontrado', HttpStatus.NOT_FOUND);
    }

    const user = await this.listUserIdUseCase.execute(req.user.id);

    if (exist.user.id !== user?.id) {
      throw new HttpException(
        'Não tem autorização para deletar',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.deleteShipmentUseCase.execute(id);

      return {
        status: 'Dados detelado',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não deletado', HttpStatus.BAD_REQUEST);
    }
  }
}
