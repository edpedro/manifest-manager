import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShippingDto } from '../dto/create-shipping.dto';
import { UpdateShippingDto } from '../dto/update-shipping.dto';
import { CreateManifestDto } from '../dto/create-manifest.dto';
import { UpdateManifestDto } from '../dto/update-manifest.dto';

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

  async findByCPF(cpf: string) {
    return await this.prisma.shipping.findFirst({
      where: {
        cpf,
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
    return await this.prisma.$transaction(async (tx) => {
      const result = await tx.shipping.update({
        where: { id },
        data: {
          status: 'Expedido',
          isConfirm: true,
          dispatch_date: updateShippingDto.dispatch_date,
          dispatch_time: updateShippingDto.dispatch_time,
        },
        include: {
          shipmentShipping: {
            include: {
              shipment: true,
            },
          },
        },
      });

      const shipmentIds = result.shipmentShipping
        .filter((item) => item.shipment)
        .map((item) => item.shipment.id);

      if (shipmentIds.length > 0) {
        await tx.shipment.updateMany({
          where: {
            id: { in: shipmentIds },
          },
          data: {
            name: result.name,
            transport: result.transport,
            cpf: result.cpf,
            dispatch_date: result.dispatch_date,
            dispatch_time: updateShippingDto.dispatch_time,
            status: 'Expedido',
          },
        });
      }

      return result;
    });
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

    const result = await this.prisma.$transaction(
      async (prisma) => {
        const createdRelations = await prisma.shipmentShipping.createMany({
          data: shipmentId.map((id) => ({
            shippingId,
            shipmentId: id,
          })),
          skipDuplicates: true,
        });

        await prisma.shipment.updateMany({
          where: {
            id: {
              in: shipmentId,
            },
          },
          data: {
            status: 'Em romaneio',
          },
        });

        await prisma.shipping.update({
          where: {
            id: shippingId,
          },
          data: {
            statusEmail: '',
            status: 'Conferência',
          },
        });

        return createdRelations;
      },
      {
        timeout: 30000,
      },
    );

    return {
      message: 'Manifesto criado com sucesso',
      count: result.count,
      relations: result,
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
    await this.prisma.$transaction(async (prisma) => {
      await prisma.shipmentShipping.delete({
        where: {
          shipmentId_shippingId: {
            shipmentId,
            shippingId,
          },
        },
      });

      await prisma.shipment.update({
        where: {
          id: shipmentId,
        },
        data: {
          status: 'Pendente',
        },
      });

      const remaining = await prisma.shipping.findUnique({
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

      await prisma.shipping.update({
        where: {
          id: shippingId,
        },
        data: dataToUpdate,
      });
    });

    return {
      message: 'Shipment removido do romaneio com sucesso',
    };
  }

  async deleteAllShipmentManifest(shippingId: number): Promise<any> {
    const result = await this.prisma.$transaction(
      async (prisma) => {
        const relations = await prisma.shipmentShipping.findMany({
          where: {
            shippingId: shippingId,
          },
          select: {
            shipmentId: true,
          },
        });

        const shipmentIds = relations.map((r) => r.shipmentId);

        const deletedRelations = await prisma.shipmentShipping.deleteMany({
          where: {
            shippingId: shippingId,
          },
        });

        if (shipmentIds.length > 0) {
          await prisma.shipment.updateMany({
            where: {
              id: {
                in: shipmentIds,
              },
            },
            data: {
              status: 'Pendente',
            },
          });
        }

        await prisma.shipping.update({
          where: {
            id: shippingId,
          },
          data: {
            statusEmail: '',
            status: 'Pendente',
          },
        });

        return { deletedRelations, shipmentIds };
      },
      {
        timeout: 30000,
      },
    );

    return {
      message: 'Manifesto deletado com sucesso',
      count: result.deletedRelations.count,
      affectedShipments: result.shipmentIds.length,
      shipmentIds: result.shipmentIds,
    };
  }
}
