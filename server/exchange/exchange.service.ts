import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Harvest, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User): Promise<any> {
    if (!user.id) throw new UnauthorizedException();

    if (!user.serverId) throw new BadRequestException();
    const harvestRequest = this.prisma.harvest.findMany();
    const dataRequest = this.prisma.user.findMany({
      orderBy: {
        activeAt: 'desc',
      },
      where: {
        // id: { not: user.id },
        serverId: user.serverId,
      },
      select: {
        picture: true,
        nickname: true,
        discord: true,
        userHarvestId: true,
        userProgress: {
          select: {
            missingOrExchangeable: {
              select: {
                amount: true,
                captured: true,
                harvest: {
                  select: {
                    type: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const [harvest, data] = await Promise.all([harvestRequest, dataRequest]);

    return {
      harvest: harvest.reduce<Record<string, Harvest>>(
        (accumulator, current) => {
          accumulator[current.id] = current;
          return accumulator;
        },
        {},
      ),
      items: data.map(({ userProgress, ...user }) => {
        return userProgress?.missingOrExchangeable.reduce(
          (accumulator, current) => {
            if (!current.captured) {
              accumulator.missing[current?.harvest?.type].push(
                current?.harvest?.id,
              );
            } else if (current.captured && current.amount) {
              accumulator.repeated[current.harvest.type].push(
                current.harvest.id,
              );
            }
            return accumulator;
          },
          {
            ...user,
            missing: { 0: [], 1: [], 2: [] } as Record<number, string[]>,
            repeated: { 0: [], 1: [], 2: [] } as Record<number, string[]>,
          },
        );
      }),
    };
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
    key: 'his' | 'mine',
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
          },
        ),
      },
    }));
  }
}
