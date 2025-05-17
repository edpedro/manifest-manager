import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';
import { CreateManifestDto } from '../dto/create-manifest.dto';

@Injectable()
export class ShippingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createShipping(data: CreateShippingDto, userId: string): Promise<any> {
    return await this.prisma.shipping.create({
      data: {
        ...data,
        user_id: userId,
      },
    });
  }

  async findAllShipping(userId?: string) {
    return await this.prisma.shipping.findMany({
      where: userId ? { user_id: userId } : undefined,
      include: {
        shipmentShipping: {
          select: {
            shipment: true,
          },
        },
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });
  }

  async findById(id: number, driverId?: string) {
    return await this.prisma.shipping.findUnique({
      where: {
        id,
        ...(driverId && { user_id: driverId }),
      },
      include: {
        shipmentShipping: {
          select: {
            shipment: true,
          },
        },
        user: {
          select: {
            id: true,
            first_name: true,
          },
        },
      },
    });
  }

  async updateShipping(id: number, data: UpdateShippingDto): Promise<any> {
    return await this.prisma.shipping.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateSendEmail(id: number): Promise<any> {
    return await this.prisma.shipping.update({
      where: {
        id,
      },
      data: {
        statusEmail: 'Enviado',
        status: 'Conferência',
      },
    });
  }

  async updateShippingStatus(
    id: number,
    updateShippingDto: UpdateShippingDto,
  ): Promise<any> {
    const result = await this.prisma.shipping.update({
      where: { id },
      data: {
        status: 'Expedido',
        isConfirm: true,
        dispatch_date: updateShippingDto.dispatch_date,
        dispatch_time: updateShippingDto.dispatch_time,
      },
      select: {
        name: true,
        transport: true,
        cpf: true,
        dispatch_date: true,
        shipmentShipping: {
          select: {
            shipment: true,
          },
        },
      },
    });

    await Promise.all(
      result.shipmentShipping.map((item) =>
        this.prisma.shipment.update({
          where: { id: item.shipment.id },
          data: {
            name: result.name,
            transport: result.transport,
            cpf: result.cpf,
            dispatch_date: result.dispatch_date,
            dispatch_time: updateShippingDto.dispatch_time,
            status: 'Expedido',
          },
        }),
      ),
    );
  }

  async removeShipping(id: number): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      const shipping = await prisma.shipping.findUnique({
        where: { id },
        select: {
          shipmentShipping: {
            select: {
              shipmentId: true,
            },
          },
        },
      });

      if (!shipping) {
        throw new Error(`Shipping com ID ${id} não encontrado`);
      }

      const shipmentIds = shipping.shipmentShipping.map((ss) => ss.shipmentId);

      if (shipmentIds.length > 0) {
        await prisma.shipmentShipping.deleteMany({
          where: {
            shippingId: id,
          },
        });

        await Promise.all(
          shipmentIds.map((shipmentId) =>
            prisma.shipment.update({
              where: { id: shipmentId },
              data: {
                name: '',
                transport: '',
                cpf: '',
                dispatch_date: null,
                dispatch_time: '',
                status: 'Pendente',
              },
            }),
          ),
        );
      }

      await prisma.shipping.delete({
        where: { id },
      });
    });
  }

  async createManifest(data: CreateManifestDto): Promise<any> {
    const { shippingId, shipmentId } = data;

    // Criar múltiplas relações entre o shipping e cada shipment
    const createdRelations = await this.prisma.$transaction(
      shipmentId.map((id) =>
        this.prisma.shipmentShipping.create({
          data: {
            shippingId,
            shipmentId: id,
          },
        }),
      ),
    );

    await this.prisma.shipping.update({
      where: {
        id: shippingId,
      },
      data: {
        statusEmail: '',
      },
    });

    return {
      message: 'Manifesto criado com sucesso',
      count: createdRelations.length,
      relations: createdRelations,
    };
  }

  async findByIdsShipmentShipping(id: number[]) {
    return await this.prisma.shipmentShipping.findMany({
      where: { shipmentId: { in: id } },
      include: {
        shipping: {
          select: {
            id: true,
            name: true,
          },
        },
        shipment: {
          select: {
            supply: true,
          },
        },
      },
    });
  }

  async deleteShipmentShipping(shipmentId: number, shippingId: number) {
    await this.prisma.shipmentShipping.delete({
      where: {
        shipmentId_shippingId: {
          shipmentId,
          shippingId,
        },
      },
    });

    const remaining = await this.prisma.shipping.findUnique({
      where: { id: shippingId },
      select: {
        shipmentShipping: {
          select: { shipmentId: true },
        },
      },
    });

    const dataToUpdate: any = {
      statusEmail: null,
    };

    if (!remaining?.shipmentShipping.length) {
      dataToUpdate.status = 'Pendente';
    }

    await this.prisma.shipping.update({
      where: {
        id: shippingId,
      },
      data: dataToUpdate,
    });
  }
}
