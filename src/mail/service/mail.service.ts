import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindIdShippingUseCase } from 'src/shipping/usecases/find-id-shipping.usecase';
import { Response } from 'express';
import { generateRomaneioExcel } from 'src/shipping/utils/createShipping';
import { EmailQueueService } from '../Queue/EmailQueueService';
import { CreateMailDto } from '../dto/create-mail.dto';
import { CreateMailUseCase } from '../usecase/create-mail.usecase';
import { FindAllMailMailUseCase } from '../usecase/find-all-mail.usecase';
import { UpdateMailUseCase } from '../usecase/update-mail.usecase';
import { DeleteMailUseCase } from '../usecase/delete-mail.usecase';
import { UpdateMailDto } from '../dto/update-mail.dto';
import { FindEMailMailUseCase } from '../usecase/find-mail-mail.usecase';
import { FindIdMailMailUseCase } from '../usecase/find-id-mail.usecase';
import { UpdateStatusMailShippingUseCase } from 'src/shipping/usecases/update-statusMail-shipping.usecase';
import { FindByIdMailMailUseCase } from '../usecase/find-byId-mail.usecase';

@Injectable()
export class MailService {
  constructor(
    private readonly findIdShippingUseCase: FindIdShippingUseCase,
    private readonly emailQueueService: EmailQueueService,
    private readonly findEMailMailUseCase: FindEMailMailUseCase,
    private readonly createMailUseCase: CreateMailUseCase,
    private readonly findAllMailMailUseCase: FindAllMailMailUseCase,
    private readonly deleteMailUseCase: DeleteMailUseCase,
    private readonly updateMailUseCase: UpdateMailUseCase,
    private readonly findIdMailMailUseCase: FindIdMailMailUseCase,
    private readonly updateStatusMailShippingUseCase: UpdateStatusMailShippingUseCase,
    private readonly findByIdMailMailUseCase: FindByIdMailMailUseCase,
  ) {}

  async sendConfirmationEmail(id: number, res: Response): Promise<void> {
    try {
      const data = await this.findIdShippingUseCase.execute(id);

      if (!data) {
        throw new Error('Dados do romaneio não encontrados');
      }

      const mails = await this.findAllMailMailUseCase.execute();

      if (mails.length <= 0) {
        throw new Error('Não tem emails cadastrados');
      }

      const dataMails = mails.map((mail) => mail.email);

      const buffer = await generateRomaneioExcel(data);

      await this.emailQueueService.addToQueue({
        to: dataMails,
        subject: `Romaneio: Nº${data.id}`,
        template: 'welcome',
        context: {
          date: getSaudacao(),
          numero: data.id,
          transporte: data.transport.toUpperCase(),
          placa: data.placa.toUpperCase(),
          motorista: data.name.toUpperCase(),
          cpf: data.cpf,
          previsao_chegada: data.estimatedArrival,
        },
        attachments: [
          {
            filename: `romaneio_${data.id}.xlsx`,
            content: buffer,
          },
        ],
      });

      function getSaudacao(): string {
        const data = new Date();
        const horaBrasilia = new Intl.DateTimeFormat('pt-BR', {
          hour: 'numeric',
          hour12: false,
          timeZone: 'America/Sao_Paulo',
        }).format(data);

        const horaAtual = Number(horaBrasilia);

        if (horaAtual >= 5 && horaAtual < 12) {
          return 'Bom dia';
        } else if (horaAtual >= 12 && horaAtual < 18) {
          return 'Boa tarde';
        } else {
          return 'Boa noite';
        }
      }

      await this.updateStatusMailShippingUseCase.execute(id);

      res.status(200).json({ message: 'Email enviado' });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      res
        .status(500)
        .json({ message: 'Erro ao enviar e-mail, tente novamente' });
    }
  }

  getQueueStatus() {
    return this.emailQueueService.getQueueStatus();
  }

  async createMail(data: CreateMailDto) {
    const mailExist = await this.findEMailMailUseCase.execute(data.email);

    if (mailExist) {
      throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.createMailUseCase.execute(data);
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Email não cadastrado', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.findAllMailMailUseCase.execute();
  }

  async findByMailId(id: number) {
    const result = await this.findByIdMailMailUseCase.execute(id);

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  async update(id: number, data: UpdateMailDto) {
    const result = await this.findIdMailMailUseCase.execute(id);

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.updateMailUseCase.execute(id, data);

      return result;
    } catch (error) {
      throw new HttpException('Dados não atualizado', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    const result = await this.findIdMailMailUseCase.execute(id);

    if (!result) {
      throw new HttpException('Dados não encontrados', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.deleteMailUseCase.execute(id);

      return result;
    } catch (error) {
      throw new HttpException('Dados não deletado', HttpStatus.BAD_REQUEST);
    }
  }
}
