import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Server, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExchangeResponse, ExchangeUser } from './models/exchange.response';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User, serverId: string): Promise<ExchangeResponse> {
    if (!user.id) throw new UnauthorizedException();

    if (!user.serverId) throw new BadRequestException();

    const server = serverId === 'user' ? user.serverId : serverId;

    const serverRequest = this.prisma.server.findMany();
    const currentUserRequest = this.getCurrentUser(user);
    const dataRequest = this.prisma.user.findMany({
      orderBy: {
        activeAt: 'desc',
      },
      where: {
        nickname: { not: null },
        ...(serverId !== 'all' && {
          serverId: server,
        }),
      },
      select: {
        id: true,
        picture: true,
        nickname: true,
        discord: true,
        userHarvestId: true,
        serverId: true,
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

    const [servers, data, currentUser] = await Promise.all([
      serverRequest,
      dataRequest,
      currentUserRequest,
    ]);

    const users = data.reduce<ExchangeUser[]>(
      (acc, { userProgress, ...user }) => {
        if (user.id === currentUser.id) return acc;

        return acc.concat(
          userProgress?.missingOrExchangeable.reduce<ExchangeUser>(
            (accumulator, current) => {
              if (
                !current.captured &&
                currentUser.repeated?.includes(current?.harvestId)
              ) {
                accumulator.missing[current.harvest.type].push(
                  current?.harvestId,
                );
              } else if (
                current.captured &&
                current.amount &&
                currentUser.missing?.includes(current.harvestId)
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
              serverId: String(user?.serverId),
              missing: { 0: [], 1: [], 2: [] },
              repeated: { 0: [], 1: [], 2: [] },
            },
          ) || [],
        );
      },
      [],
    );

    return {
      users,
      currentServer: server,
      servers: servers.reduce<Record<string, Server>>(
        (accumulator, current) => {
          accumulator[current.id] = current;
          return accumulator;
        },
        { all: { id: 'all', name: '-', type: 0 } },
      ),
    };
  }

  async getCurrentUser(user: User) {
    const currentUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        id: true,
        picture: true,
        nickname: true,
        discord: true,
        userHarvestId: true,
        serverId: true,
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

    if (!currentUser) throw new BadRequestException();

    return {
      id: String(currentUser.id),
      picture: String(currentUser.picture),
      nickname: String(currentUser.nickname),
      discord: String(currentUser.discord),
      userHarvestId: currentUser.userHarvestId,
      ...currentUser.userProgress?.missingOrExchangeable.reduce<{
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
  }
}
