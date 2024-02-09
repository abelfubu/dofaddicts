import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Harvest, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExchangeResponse, ExchangeUser } from './models/exchange.response';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User): Promise<ExchangeResponse> {
    if (!user.id) throw new UnauthorizedException();

    if (!user.serverId) throw new BadRequestException();
    const harvestRequest = this.prisma.harvest.findMany();
    const dataRequest = this.prisma.user.findMany({
      orderBy: {
        activeAt: 'desc',
      },
      where: {
        serverId: user.serverId,
      },
      select: {
        id: true,
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
                harvestId: true,
                harvest: {
                  select: {
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const [harvest, data] = await Promise.all([harvestRequest, dataRequest]);

    const me = data.find((u) => u.id === user.id);

    if (!me) throw new BadRequestException();

    const zazhem = {
      picture: me.picture,
      nickname: me.nickname,
      discord: me.discord,
      userHarvestId: me.userHarvestId,
      ...me.userProgress?.missingOrExchangeable.reduce<{
        missing: string[];
        repeated: string[];
      }>(
        (accumulator, current) => {
          if (!current.captured) {
            accumulator.missing.push(current?.harvestId);
          } else if (current.captured && current.amount) {
            accumulator.repeated.push(current.harvestId);
          }
          return accumulator;
        },
        { missing: [], repeated: [] },
      ),
    };

    const users = data.reduce<ExchangeUser[]>(
      (acc, { userProgress, ...user }) => {
        if (user.id === me.id) return acc;

        return acc.concat(
          userProgress!.missingOrExchangeable.reduce<ExchangeUser>(
            (accumulator, current) => {
              if (
                !current.captured &&
                zazhem.repeated?.includes(current?.harvestId)
              ) {
                accumulator.missing[current.harvest.type].push(
                  current?.harvestId,
                );
              } else if (
                current.captured &&
                current.amount &&
                zazhem.missing?.includes(current.harvestId)
              ) {
                accumulator.repeated[current.harvest.type].push(
                  current.harvestId,
                );
              }
              return accumulator;
            },
            {
              picture: String(user?.picture),
              discord: String(user?.discord),
              nickname: String(user?.nickname),
              userHarvestId: String(user?.userHarvestId),
              missing: { 0: [], 1: [], 2: [] },
              repeated: { 0: [], 1: [], 2: [] },
            },
          ),
        );
      },
      [],
    );

    return {
      users,
      harvest: harvest.reduce<Record<string, Harvest>>(
        (accumulator, current) => {
          accumulator[current.id] = current;
          return accumulator;
        },
        {},
      ),
    };
  }
}
