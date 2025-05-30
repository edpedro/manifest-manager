import { CreateShipmentUseCase } from './../usecases/create-shipment.usecase';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';
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
import { ShipmentDto, ShipmentPendingDto } from '../dto/shipment.dto';
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
import { ExtradorDto, SearchDto } from '../dto/search';
import { FindAllSTSupplyNFShipmentUseCase } from '../usecases/find-all-shipment.usecase';
import pLimit from 'p-limit';
import { FindAllPendingInShippingShipmentUseCase } from '../usecases/find-pendingInShipping-shipment.usecase';
import { ListAllInvoicesShipmentUseCase } from '../usecases/list-allInvoices-shipment.usecase';

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
    private readonly findAllSTSupplyNFShipmentUseCase: FindAllSTSupplyNFShipmentUseCase,
    private readonly findAllPendingInShippingShipmentUseCase: FindAllPendingInShippingShipmentUseCase,
    private readonly listAllInvoicesShipmentUseCase: ListAllInvoicesShipmentUseCase,
  ) {}
  async create(file: UploadDto, req: ReqUserDto) {
    const dataExcel = await createExcelManager(file, req.user.id);

    const supplys = dataExcel.map((supply) => supply.supply);
    const invoices = dataExcel.map((supply) => supply.invoice_number);

    const resultSupplys =
      await this.listAllSupplysShipmentUseCase.execute(supplys);
    const resultInvoices =
      await this.listAllInvoicesShipmentUseCase.execute(invoices);

    let dataCreate: CreateShipmentDto[] = [];
    let dataError: CreateShipmentDto[] = [];

    if (resultSupplys.length > 0) {
      const idsRemover = new Set(resultSupplys.map((item) => item.supply));

      const isRemover = dataExcel.filter(
        (item) => !idsRemover.has(item.supply),
      );
      dataCreate.push(...isRemover);
      dataError.push(...resultSupplys);
    } else if (resultInvoices.length > 0) {
      const idsRemover = new Set(
        resultInvoices.map((item) => item.invoice_number),
      );

      const isRemover = dataExcel.filter(
        (item) => !idsRemover.has(item.invoice_number),
      );
      dataCreate.push(...isRemover);
      dataError.push(...resultInvoices);
    } else {
      const idsRemover = new Set(dataError.map((item) => item.supply));

      const result = dataExcel.filter((item) => !idsRemover.has(item.supply));

      dataCreate.push(...result);
    }
    const removeDuplicatesBySupply = (dataCreate: any[]) => {
      const seen = new Set();
      return dataCreate.filter((item) => {
        if (seen.has(item.supply)) return false;
        seen.add(item.supply);
        return true;
      });
    };

    try {
      const duplicate = removeDuplicatesBySupply(dataCreate);

      await this.createShipmentUseCase.execute(duplicate);

      return { dataCreate, dataError };
    } catch (error) {
      console.log(error);
      throw new HttpException('Dados não cadastrados', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.listAllShipmentUseCase.execute();
  }

  async findAllPendingShipping() {
    const result = await this.findAllPendingInShippingShipmentUseCase.execute();

    const now = new Date();
    const timeZone = 'America/Sao_Paulo';

    const pedingInShipping = result.map((invoice) => {
      const newPening: ShipmentPendingDto = { ...invoice };

      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const todayStr = formatter.format(now);

      function parsePtBrDate(str: string) {
        const [dia, mes, ano] = str.split('/');
        return new Date(`${ano}-${mes}-${dia}`);
      }

      function getDateOnly(date: Date): string {
        return date.toISOString().split('T')[0];
      }

      const todayDate = parsePtBrDate(todayStr);
      const dispatchDateStr = getDateOnly(invoice.invoice_issue_date);

      const dispatchClean = new Date(dispatchDateStr);

      const diffMs = dispatchClean.getTime() - todayDate.getTime();

      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays <= -3) {
        newPening.cor = 'red';
      } else if (diffDays <= -2) {
        newPening.cor = 'yellow';
      } else {
        newPening.cor = 'green';
      }
      return newPening;
    });

    return pedingInShipping;
  }

  async findOne(id: number) {
    const data = await this.listIdShipmentUseCase.execute(id);

    if (!data) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return data;
  }

  async search(search: SearchDto) {
    try {
      const results = await Promise.all([
        this.searchStUseCase.execute(search.searchData),
        this.searchInvoiceUseCase.execute(search.searchData),
        this.searchSupplyUseCase.execute(search.searchData),
      ]);

      return results.flat();
    } catch (error) {
      console.error('Erro interno na busca:', error);
      throw new HttpException('Erro ao realizar busca', HttpStatus.NOT_FOUND);
    }
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

    if (data.status === 'Expedido') {
      throw new HttpException(
        'Não pode ser alterado, Nota fiscal já foi expedido',
        HttpStatus.NOT_FOUND,
      );
    }

    if (req.user.type === 'driver') {
      throw new HttpException(
        'Não tem permissão para alterar',
        HttpStatus.NOT_FOUND,
      );
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

    if (stExist.status === 'Expedido') {
      throw new HttpException(
        'Não pode ser alterado, Nota fiscal já foi expedido',
        HttpStatus.NOT_FOUND,
      );
    }

    if (req.user.type === 'driver') {
      throw new HttpException(
        'Não tem permissão para alterar',
        HttpStatus.NOT_FOUND,
      );
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

    if (exist.status === 'Expedido') {
      throw new HttpException(
        'Nota fiscal não pode ser deletada!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (exist.status === 'Em romaneio') {
      throw new HttpException(
        'Nota fiscal está vinculada ao romaneio!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (req.user.type === 'driver') {
      throw new HttpException(
        'Não tem permissão para alterar',
        HttpStatus.NOT_FOUND,
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
        data.setUTCHours(23, 59, 59, 999); // sem conversão de fuso
      } else {
        data.setUTCHours(0, 0, 0, 0); // sem conversão de fuso
      }

      return data.toISOString();
    }

    const result = await this.dateFindAllUseCase.execute(date_start, date_end);

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Dados não encontrados',
      });
    }

    try {
      const resultsWithStringDates = result.map((item) => {
        const formattedItem = { ...item };
        Object.keys(formattedItem).forEach((key) => {
          if (formattedItem[key] instanceof Date) {
            const date = new Date(formattedItem[key]);
            // Formata como string no formato desejado
            formattedItem[key] = date.toLocaleDateString('pt-BR', {
              timeZone: 'UTC',
            });
          }
        });
        return formattedItem;
      });

      const renamedResults = await renameExpedicaoFields(
        resultsWithStringDates,
      );

      const ws = XLSX.utils.json_to_sheet(renamedResults);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, 'lista.xlsx');

      const file = join(__dirname, '..', '..', '..', 'lista.xlsx');
      res.download(file, `lista_${date_start}-${date_end}.xlsx`);
    } catch (error) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  async exportStSupplyNFExcel(
    data: ExtradorDto,
    req: ReqUserDto,
    @Res() res: Response,
  ) {
    const results = await this.findAllSTSupplyNFShipmentUseCase.execute(
      data.valeu,
    );

    if (results.length <= 0) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    const resultsWithStringDates = results.map((item) => {
      const formattedItem = { ...item };
      Object.keys(formattedItem).forEach((key) => {
        if (formattedItem[key] instanceof Date) {
          const date = new Date(formattedItem[key]);
          // Formata como string no formato desejado
          formattedItem[key] = date.toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
          });
        }
      });
      return formattedItem;
    });

    const renamedResults = await renameExpedicaoFields(resultsWithStringDates);

    const numbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 101),
    );

    const ws = XLSX.utils.json_to_sheet(renamedResults);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'lista.xlsx');

    const file = join(__dirname, '..', '..', '..', 'lista.xlsx');
    res.download(file, `lista_STs${numbers.join('')}.xlsx`);

    return results;
  }

  async ExpeditionExcel(file: UploadDto, req: ReqUserDto) {
    try {
      const dataExcel = await expeditionExcelManager(file, req.user.id);
      const limit = pLimit(5); // máx 5 execuções simultâneas
      const updatedSupplies: ShipmentDto[] = [];

      const promises = dataExcel.map((item) =>
        limit(async () => {
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

            return this.updateExpeditionShipmentUseCase.execute(
              existing.id,
              updateData,
              req.user.id,
            );
          }
          return null;
        }),
      );

      const results = await Promise.allSettled(promises);

      results.forEach((res) => {
        if (res.status === 'fulfilled' && res.value) {
          updatedSupplies.push(res.value);
        }
      });

      return updatedSupplies;
    } catch (error) {
      console.error('Erro completo na expedição:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof HttpException
      ) {
        throw error;
      }

      throw new HttpException('Dados não atualizados', HttpStatus.BAD_REQUEST);
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
        city: '',
        uf: '',
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
        city: '',
        uf: '',
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

    function countSuppliesPorData(dados: ShipmentDto[]) {
      const resultado: {
        [key: string]: { dataCompleta: string; count: number };
      } = {};

      dados.forEach((item) => {
        if (!item.invoice_issue_date || !item.supply) return;

        const date = new Date(item.invoice_issue_date);
        const ano = date.getFullYear();
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const dia = date.getDate().toString().padStart(2, '0');

        const chave = `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD

        if (!resultado[chave]) {
          resultado[chave] = {
            dataCompleta: chave,
            count: 0,
          };
        }

        resultado[chave].count++;
      });

      // Ordena por data (do mais antigo para o mais recente)
      return Object.values(resultado).sort((a, b) =>
        a.dataCompleta.localeCompare(b.dataCompleta),
      );
    }

    const totaisPorMes = countSuppliesPorData(result);

    return {
      data: {
        TotalSupply,
        TotalSt,
        SomaValeu,
        TotalExpedition,
        totaisPorMes,
      },
    };
  }
}
