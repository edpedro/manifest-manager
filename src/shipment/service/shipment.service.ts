import { CreateShipmentUseCase } from './../usecases/create-shipment.usecase';
import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
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
import { DateShipmentDto } from '../dto/date-shipment.dto';
import { DateFindAllUseCase } from '../usecases/date-all-shipment.usecase';
import { renameExpedicaoFields } from '../utils/renameExpedicaoFields';
import * as XLSX from 'xlsx';
import { join } from 'path';
import { Response } from 'express';
import { ListAllStShipmentUseCase } from '../usecases/list-allSt-shipment.usecase';
import { expeditionExcelManager } from '../utils/expeditionExcelManager';
import { ListBySupplysShipmentUseCase } from '../usecases/list-bySupplys-shipment.usecase';
import { UpdateExpeditionShipmentUseCase } from '../usecases/update-expedition-shipment.usecase';
import { SearchDto } from '../dto/search';

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
    private readonly dateFindAllUseCase: DateFindAllUseCase,
    private readonly listAllStShipmentUseCase: ListAllStShipmentUseCase,
    private readonly listBySupplysShipmentUseCase: ListBySupplysShipmentUseCase,
    private readonly updateExpeditionShipmentUseCase: UpdateExpeditionShipmentUseCase,
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

  async search(search: SearchDto) {
    const promises: Promise<ShipmentDto[]>[] = [];

    promises.push(this.searchStUseCase.execute(search.searchData));
    promises.push(this.searchInvoiceUseCase.execute(search.searchData));
    promises.push(this.searchSupplyUseCase.execute(search.searchData));

    const results = await Promise.all(promises);

    const data = results.flat();

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

  async exportDateExcel(
    data: DateShipmentDto,
    req: ReqUserDto,
    @Res() res: Response,
  ) {
    const date_start = converterDataParaISOComFuso(data.data_start);
    const date_end = converterDataParaISOComFuso(data.date_end, true);

    function converterDataParaISOComFuso(
      dataString: string,
      finalDoDia = false,
    ): string {
      const data = new Date(dataString);

      if (finalDoDia) {
        // Ajusta para 03:00:00 do dia seguinte para garantir que inclui até esse horário
        data.setDate(data.getDate() + 1);
        data.setHours(3, 0, 0, 0);
      } else {
        data.setHours(3, 0, 0, 0);
      }

      return data.toISOString();
    }

    const result = await this.dateFindAllUseCase.execute(date_start, date_end);

    const renamedResults = await renameExpedicaoFields(result);

    const ws = XLSX.utils.json_to_sheet(renamedResults);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'lista.xlsx');

    const file = join(__dirname, '..', '..', '..', 'lista.xlsx');
    res.download(file, `lista_${date_start}-${date_end}.xlsx`);

    return result;
  }

  async exportStExcel(st: string[], req: ReqUserDto, @Res() res: Response) {
    const stExist = await this.listAllStShipmentUseCase.execute(st);

    if (!stExist) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    const renamedResults = await renameExpedicaoFields(stExist);

    const numbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 101),
    );

    const ws = XLSX.utils.json_to_sheet(renamedResults);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'lista.xlsx');

    const file = join(__dirname, '..', '..', '..', 'lista.xlsx');
    res.download(file, `lista_STs${numbers.join('')}.xlsx`);

    return stExist;
  }

  async exportSupplyExcel(
    supply: string[],
    req: ReqUserDto,
    @Res() res: Response,
  ) {
    const supplyExist =
      await this.listAllSupplysShipmentUseCase.execute(supply);

    if (!supplyExist) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    const renamedResults = await renameExpedicaoFields(supplyExist);

    const numbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 101),
    );

    const ws = XLSX.utils.json_to_sheet(renamedResults);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'lista.xlsx');

    const file = join(__dirname, '..', '..', '..', 'lista.xlsx');
    res.download(file, `lista_supplys${numbers.join('')}.xlsx`);

    return supplyExist;
  }

  async ExpeditionExcel(file: UploadDto, req: ReqUserDto) {
    try {
      const dataExcel = await expeditionExcelManager(file, req.user.id);

      const updatedSupplies: ShipmentDto[] = [];

      for (const item of dataExcel) {
        const existing = await this.listBySupplysShipmentUseCase.execute(
          item.supply,
        );

        if (existing) {
          const updateData: UpdateShipmentDto = {
            name: item.name,
            transport: item.transport,
            cpf: item.cpf,
            dispatch_date: item.dispatch_date,
            dispatch_time: item.dispatch_time,
            status: 'Expedido',
          };

          const update = await this.updateExpeditionShipmentUseCase.execute(
            existing.id,
            updateData,
            req.user.id,
          );
          updatedSupplies.push(update);
        }
      }

      return updatedSupplies;
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não cadastrados', HttpStatus.BAD_REQUEST);
    }
  }

  async modelExcel(@Res() res: Response) {
    const st: any[] = [
      {
        st: '',
        supply: '',
        invoice_number: '',
        invoice_issue_date: '',
        destination: '',
        carrier: '',
        transport_mode: '',
        Valeu_invoice: '',
        category: '',
      },
    ];

    const renamedResults = await renameExpedicaoFields(st);

    const numbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 101),
    );

    const ws = XLSX.utils.json_to_sheet(renamedResults);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'lista.xlsx');

    const file = join(__dirname, '..', '..', '..', 'lista.xlsx');
    res.download(file, `lista_modelo${numbers.join('')}.xlsx`);

    return;
  }

  async modelExpeditionExcel(@Res() res: Response) {
    const st: any[] = [
      {
        st: '',
        supply: '',
        invoice_number: '',
        invoice_issue_date: '',
        destination: '',
        carrier: '',
        transport_mode: '',
        Valeu_invoice: '',
        category: '',
        name: '',
        transport: '',
        cpf: '',
        dispatch_date: '',
        dispatch_time: '',
      },
    ];

    const renamedResults = await renameExpedicaoFields(st);

    const numbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 101),
    );

    const ws = XLSX.utils.json_to_sheet(renamedResults);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'lista.xlsx');

    const file = join(__dirname, '..', '..', '..', 'lista.xlsx');
    res.download(file, `lista_expedicao${numbers.join('')}.xlsx`);

    return;
  }

  async dashboard() {
    const result = await this.listAllShipmentUseCase.execute();

    let TotalSupply: number = 0;
    let TotalSt: number = 0;
    let SomaValeu: number = 0;
    let TotalExpedition: number = 0;

    result.forEach((item) => {
      if (item.supply !== null && item.status === 'Expedido') {
        TotalExpedition = TotalExpedition + 1;
      }
      if (item.supply !== null) {
        TotalSupply = TotalSupply + 1;
      }
      if (item.Valeu_invoice !== null) {
        SomaValeu += item.Valeu_invoice;
      }
    });

    const removeDuplicatesSts = Array.from(
      new Set(result.map((d) => d.st)),
    ).map((st) => {
      return result.find((value) => value.st === st);
    });

    removeDuplicatesSts.forEach((item) => {
      if (item?.st !== null) {
        TotalSt = TotalSt + 1;
      }
    });

    function formatDate(date: Date | null) {
      if (!date) return null; // Ou '' se quiser
      return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    const supplyDate = result.map((item) => ({
      supply: item.supply,
      date: formatDate(item.invoice_issue_date),
    }));

    return {
      data: {
        TotalSupply,
        TotalSt,
        SomaValeu,
        TotalExpedition,
        supplyDate,
      },
    };
  }
}
