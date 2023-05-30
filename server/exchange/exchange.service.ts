import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Harvest, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExchangeResponse } from './models/exchange.response';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User): Promise<ExchangeResponse[]> {
    if (!user.id) throw new UnauthorizedException();

    if (!user.serverId) throw new BadRequestException();

    const querys = [
      this.prisma.harvestItem.findMany(
        this.getExchangeQuery(user.id, { captured: true })
      ),
      this.prisma.harvestItem.findMany(
        this.getExchangeQuery(user.id, { amount: { gt: 0 } })
      ),
    ];

    const [missing, repeated] = await Promise.all(querys);

    const [fromUsers, fromMe] = await Promise.all([
      this.getAvailableItems(
        user,
        {
          amount: { gt: 0 },
          AND: {
            harvestId: { notIn: missing.map((x) => x.harvestId) },
          },
        },
        'his'
      ),
      this.getAvailableItems(
        user,
        {
          captured: false,
          AND: {
            harvestId: { in: repeated.map((x) => x.harvestId) },
          },
        },
        'mine'
      ),
    ]);

    // @ts-ignore
    return fromUsers.map((user) => {
      const found = fromMe.find((x) => x.userHarvestId === user.userHarvestId);
      return found
        ? {
            ...user,
            harvest: {
              his: user.harvest['his'],
              mine: found.harvest['mine'],
            },
          }
        : user;
    });
  }

  private getExchangeQuery(id: string, AND: Record<string, unknown>) {
    return {
      where: {
        userHarvest: { user: { id } },
        AND,
      },
      select: {
        harvestId: true,
      },
    };
  }

  private async getAvailableItems(
    { id, serverId }: User,
    where: Record<string, unknown>,
    key: 'his' | 'mine'
  ) {
    const result = await this.prisma.user.findMany({
      orderBy: {
        activeAt: 'desc',
      },
      where: {
        id: { not: id },
        serverId,
      },
      select: {
        picture: true,
        nickname: true,
        discord: true,
        server: {
          select: {
            name: true,
          },
        },
        userHarvestId: true,
        harvest: {
          select: {
            harvest: {
              select: {
                harvest: true,
              },
              where,
            },
          },
        },
      },
    });

    return result.map((user) => ({
      ...user,
      server: user?.server?.name!,
      harvest: {
        [key]: user.harvest.harvest.reduce<Record<number, Harvest[]>>(
          (acc, user) => {
            acc[user.harvest.type].push(user.harvest);
            return acc;
          },
          {
            0: [],
            1: [],
            2: [],
          }
        ),
      },
    }));
  }
}
