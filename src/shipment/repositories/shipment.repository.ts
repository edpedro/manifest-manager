import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';
import { ShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class ShipmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createShipment(data: CreateShipmentDto[]): Promise<any> {
    return await this.prisma.shipment.createMany({
      data,
    });
  }

  async supplysAllShipment(data: string[]): Promise<any> {
    return await this.prisma.shipment.findMany({
      where: {
        supply: {
          in: data,
        },
      },
      include: {
        user: {
          select: {
            first_name: true,
          },
        },
      },
    });
  }

  async findAllShipment(): Promise<ShipmentDto[]> {
    const shipments = await this.prisma.shipment.findMany({
      select: {
        id: true,
        st: true,
        supply: true,
        invoice_number: true,
        invoice_issue_date: true,
        destination: true,
        carrier: true,
        transport_mode: true,
        Valeu_invoice: true,
        category: true,
        name: true,
        transport: true,
        cpf: true,
        dispatch_date: true,
        dispatch_time: true,
        status: true,
        observation: true,
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });

    return shipments.map((shipment) => ({
      ...shipment,
      name: shipment.user?.first_name ?? null,
      Valeu_invoice:
        shipment.Valeu_invoice !== null ? Number(shipment.Valeu_invoice) : null,
      dispatch_date: shipment.dispatch_date
        ? shipment.dispatch_date.toISOString()
        : null,
    }));
  }

  async findIdShipment(idShipment: number): Promise<ShipmentDto> {
    const shipment = await this.prisma.shipment.findUnique({
      where: {
        id: idShipment,
      },
      select: {
        id: true,
        st: true,
        supply: true,
        invoice_number: true,
        invoice_issue_date: true,
        destination: true,
        carrier: true,
        transport_mode: true,
        Valeu_invoice: true,
        category: true,
        name: true,
        transport: true,
        cpf: true,
        dispatch_date: true,
        dispatch_time: true,
        status: true,
        observation: true,
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });

    if (!shipment) {
      throw new BadRequestException('Dados não encontrado');
    }

    return {
      id: shipment.id,
      st: shipment.st,
      supply: shipment.supply,
      invoice_number: shipment.invoice_number,
      invoice_issue_date: shipment.invoice_issue_date,
      destination: shipment.destination,
      carrier: shipment.carrier,
      transport_mode: shipment.transport_mode,
      Valeu_invoice: shipment.Valeu_invoice
        ? shipment.Valeu_invoice.toNumber()
        : null,
      name: shipment.user?.first_name ?? null,
      transport: shipment.transport ?? null,
      cpf: shipment.cpf ?? null,
      dispatch_date: shipment.dispatch_date
        ? shipment.dispatch_date.toISOString()
        : null,
      dispatch_time: shipment.dispatch_time ?? null,
      status: shipment.status ?? null,
      observation: shipment.observation ?? null,
      category: shipment.category,
      user: {
        id: shipment.user.id,
        first_name: shipment.user.first_name,
      },
    };
  }

  async findIdSTShipment(ST: string): Promise<ShipmentDto | null> {
    const shipment = await this.prisma.shipment.findFirst({
      where: {
        st: ST,
      },
      select: {
        id: true,
        st: true,
        supply: true,
        invoice_number: true,
        invoice_issue_date: true,
        destination: true,
        carrier: true,
        transport_mode: true,
        Valeu_invoice: true,
        category: true,
        name: true,
        transport: true,
        cpf: true,
        dispatch_date: true,
        dispatch_time: true,
        status: true,
        observation: true,
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });

    if (!shipment) return null;

    return {
      id: shipment.id,
      st: shipment.st,
      supply: shipment.supply,
      invoice_number: shipment.invoice_number,
      invoice_issue_date: shipment.invoice_issue_date,
      destination: shipment.destination,
      carrier: shipment.carrier,
      transport_mode: shipment.transport_mode,
      Valeu_invoice: shipment.Valeu_invoice
        ? shipment.Valeu_invoice.toNumber()
        : null,
      name: shipment.user?.first_name ?? null,
      transport: shipment.transport ?? null,
      cpf: shipment.cpf ?? null,
      dispatch_date: shipment.dispatch_date
        ? shipment.dispatch_date.toISOString()
        : null,
      dispatch_time: shipment.dispatch_time ?? null,
      status: shipment.status ?? null,
      observation: shipment.observation ?? null,
      category: shipment.category,
      user: {
        id: shipment.user.id,
        first_name: shipment.user.first_name,
      },
    };
  }

  async updateShipment(
    id: number,
    data: UpdateShipmentDto,
    userId: string,
  ): Promise<any> {
    return await this.prisma.$transaction(async (prisma) => {
      const updateShipment = await prisma.shipment.update({
        where: {
          id,
        },
        data,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
            },
          },
        },
      });

      if (!updateShipment) {
        throw new BadRequestException('Dados não encontrado');
      }

      await prisma.history.create({
        data: {
          user_id: userId,
          shipment_id: id,
          action: 'UPDATE',
        },
      });

      return {
        id: updateShipment.id,
        st: updateShipment.st,
        supply: updateShipment.supply,
        invoice_number: updateShipment.invoice_number,
        invoice_issue_date: updateShipment.invoice_issue_date,
        destination: updateShipment.destination,
        carrier: updateShipment.carrier,
        transport_mode: updateShipment.transport_mode,
        Valeu_invoice: updateShipment.Valeu_invoice
          ? updateShipment.Valeu_invoice.toNumber()
          : null,
        name: updateShipment.user?.first_name ?? null,
        transport: updateShipment.transport ?? null,
        cpf: updateShipment.cpf ?? null,
        dispatch_date: updateShipment.dispatch_date
          ? updateShipment.dispatch_date.toISOString()
          : null,
        dispatch_time: updateShipment.dispatch_time ?? null,
        status: updateShipment.status ?? null,
        observation: updateShipment.observation ?? null,
        category: updateShipment.category,
        user: {
          first_name: updateShipment.user.first_name,
        },
      };
    });
  }

  async updateSTShipment(
    stExits: string,
    newST: string,
    userId: string,
  ): Promise<any[]> {
    return await this.prisma.$transaction(async (prisma) => {
      // Buscar todos os shipments com o ST antigo
      const existingShipments = await prisma.shipment.findMany({
        where: { st: stExits },
        select: { id: true },
      });

      if (existingShipments.length === 0) {
        throw new BadRequestException('Nenhum dado encontrado');
      }

      // Atualizar todos os shipments
      await prisma.shipment.updateMany({
        where: { st: stExits },
        data: { st: newST },
      });

      // Criar histórico para todos os IDs encontrados
      const historyData = existingShipments.map((shipment) => ({
        user_id: userId,
        shipment_id: shipment.id,
        action: 'UPDATE-ST',
      }));

      await prisma.history.createMany({
        data: historyData,
      });

      // Buscar todos os registros atualizados (opcional, depende se você precisa retornar isso)
      const updatedShipments = await prisma.shipment.findMany({
        where: {
          id: { in: existingShipments.map((s) => s.id) },
        },
        include: {
          user: {
            select: {
              first_name: true,
            },
          },
        },
      });

      // Retornar os dados atualizados (formate se necessário)
      return updatedShipments.map((shipment) => ({
        id: shipment.id,
        st: shipment.st,
        supply: shipment.supply,
        invoice_number: shipment.invoice_number,
        invoice_issue_date: shipment.invoice_issue_date,
        destination: shipment.destination,
        carrier: shipment.carrier,
        transport_mode: shipment.transport_mode,
        Valeu_invoice: shipment.Valeu_invoice
          ? shipment.Valeu_invoice.toNumber()
          : null,
        name: shipment.user?.first_name ?? null,
        transport: shipment.transport ?? null,
        cpf: shipment.cpf ?? null,
        dispatch_date: shipment.dispatch_date
          ? shipment.dispatch_date.toISOString()
          : null,
        dispatch_time: shipment.dispatch_time ?? null,
        status: shipment.status ?? null,
        observation: shipment.observation ?? null,
        category: shipment.category,
        user: {
          first_name: shipment.user?.first_name ?? null,
        },
      }));
    });
  }

  async deleteByIdShipment(
    id: number,
  ): Promise<{ id: number; deleted: boolean }> {
    await this.prisma.shipment.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  }

  async searchStShipment(st: string): Promise<ShipmentDto[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: {
        st,
      },
      select: {
        id: true,
        st: true,
        supply: true,
        invoice_number: true,
        invoice_issue_date: true,
        destination: true,
        carrier: true,
        transport_mode: true,
        Valeu_invoice: true,
        category: true,
        name: true,
        transport: true,
        cpf: true,
        dispatch_date: true,
        dispatch_time: true,
        status: true,
        observation: true,
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });

    return shipments.map((shipment) => ({
      ...shipment,
      name: shipment.user?.first_name ?? null,
      Valeu_invoice:
        shipment.Valeu_invoice !== null ? Number(shipment.Valeu_invoice) : null,
      dispatch_date: shipment.dispatch_date
        ? shipment.dispatch_date.toISOString()
        : null,
    }));
  }

  async searchSupplyShipment(supply: string): Promise<ShipmentDto[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: {
        supply,
      },
      select: {
        id: true,
        st: true,
        supply: true,
        invoice_number: true,
        invoice_issue_date: true,
        destination: true,
        carrier: true,
        transport_mode: true,
        Valeu_invoice: true,
        category: true,
        name: true,
        transport: true,
        cpf: true,
        dispatch_date: true,
        dispatch_time: true,
        status: true,
        observation: true,
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });

    return shipments.map((shipment) => ({
      ...shipment,
      name: shipment.user?.first_name ?? null,
      Valeu_invoice:
        shipment.Valeu_invoice !== null ? Number(shipment.Valeu_invoice) : null,
      dispatch_date: shipment.dispatch_date
        ? shipment.dispatch_date.toISOString()
        : null,
    }));
  }

  async searchInvoiceShipment(invoice_number: string): Promise<ShipmentDto[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: {
        invoice_number,
      },
      select: {
        id: true,
        st: true,
        supply: true,
        invoice_number: true,
        invoice_issue_date: true,
        destination: true,
        carrier: true,
        transport_mode: true,
        Valeu_invoice: true,
        category: true,
        name: true,
        transport: true,
        cpf: true,
        dispatch_date: true,
        dispatch_time: true,
        status: true,
        observation: true,
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });

    return shipments.map((shipment) => ({
      ...shipment,
      name: shipment.user?.first_name ?? null,
      Valeu_invoice:
        shipment.Valeu_invoice !== null ? Number(shipment.Valeu_invoice) : null,
      dispatch_date: shipment.dispatch_date
        ? shipment.dispatch_date.toISOString()
        : null,
    }));
  }
}
