import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
import { MailerService } from '@nestjs-modules/mailer';

interface EmailJob {
  to: string | string[];
  subject: string;
  template?: string;
  context?: any;
  attachments?: any[];
  headers?: any;
}

@Injectable()
export class EmailQueueService implements OnModuleInit {
  private queue: EmailJob[] = [];
  private isProcessing = false;
  private eventEmitter = new EventEmitter();
  private processingInterval = 500; // Intervalo entre envios em ms

  constructor(private readonly mailerService: MailerService) {
    // Configurar listener para processar emails quando adicionados à fila
    this.eventEmitter.on('email-added', () => {
      this.processQueue();
    });
  }

  onModuleInit() {
    // Iniciar o processamento da fila quando o módulo iniciar
    this.processQueue();
  }

  // Adicionar email à fila
  async addToQueue(emailJob: EmailJob): Promise<void> {
    console.log(
      `Email para ${emailJob.to} adicionado à fila. Tamanho atual: ${this.queue.length + 1}`,
    );
    this.queue.push(emailJob);
    this.eventEmitter.emit('email-added');
  }

  // Verificar status da fila
  getQueueStatus(): { length: number; isProcessing: boolean } {
    return {
      length: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }

  // Processar a fila de emails
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Usando nullish assertion para garantir que job não é undefined
      const job = this.queue.shift();

      // Verificação adicional para garantir que job não é undefined
      if (job) {
        console.log(`Processando email para: ${job.to}`);
        await this.sendEmail(job);
      } else {
        console.warn('Job indefinido encontrado na fila');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    } finally {
      this.isProcessing = false;

      // Continuar processando se ainda houver emails na fila
      // Adicionando um pequeno intervalo para não sobrecarregar o servidor SMTP
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), this.processingInterval);
      }
    }
  }

  // Enviar email usando o mailerService
  private async sendEmail(job: EmailJob): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: job.to,
        subject: job.subject,
        template: job.template,
        context: job.context,
        attachments: job.attachments,
        headers: job.headers,
      });
      console.log(`Email enviado com sucesso para ${job.to}`);
    } catch (error) {
      console.error(`Falha ao enviar email para ${job.to}:`, error);
      // Recoloca na fila para nova tentativa (com limite máximo de 3 tentativas)
      if (!job.context?.retryCount || job.context.retryCount < 3) {
        const updatedJob = { ...job };
        if (!updatedJob.context) updatedJob.context = {};
        updatedJob.context.retryCount =
          (updatedJob.context.retryCount || 0) + 1;

        console.log(
          `Reagendando email para ${job.to} - tentativa ${updatedJob.context.retryCount}`,
        );
        this.queue.push(updatedJob);
      } else {
        console.error(
          `Desistindo de enviar email para ${job.to} após 3 tentativas`,
        );
      }
    }
  }
}
