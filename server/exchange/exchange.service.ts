import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Server, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExchangeWithResponse } from './models/exchange-with.response';
import { ExchangeResponse } from './models/exchange.response';
import { ExchangeUser } from './models/exchante-user.model';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User, serverId: string): Promise<ExchangeResponse> {
    if (!user.id) throw new UnauthorizedException();

    if (!user.serverId) throw new BadRequestException();

    const server = serverId === 'user' ? user.serverId : serverId;

    const serverRequest = this.prisma.server.findMany();
    const currentUserRequest = this.getCurrentUser(String(user.nickname));
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
        server: {
          select: {
            name: true,
          },
        },
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
              server: String(user?.server?.name),
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

  async with(user: User, username: string): Promise<ExchangeWithResponse> {
    const [currentUser, targetUser, totalHarvest] = await Promise.all([
      this.getCurrentUser(String(user.nickname)),
      this.getCurrentUser(username),
      this.prisma.harvest.findMany(),
    ]);

    currentUser.repeated = currentUser.repeated?.filter((id) =>
      targetUser.missing?.includes(id),
    );

    targetUser.repeated = targetUser.repeated?.filter((id) =>
      currentUser.missing?.includes(id),
    );

    return {
      currentUser: {
        ...currentUser,
        missing: [],
        repeated: totalHarvest.filter((item) =>
          currentUser.repeated?.includes(item.id),
        ),
      },
      targetUser: {
        ...targetUser,
        missing: [],
        repeated: totalHarvest.filter((item) =>
          targetUser.repeated?.includes(item.id),
        ),
      },
    };
  }

  private async getCurrentUser(username: string) {
    const currentUser = await this.prisma.user.findFirst({
      where: { nickname: { equals: username, mode: 'insensitive' } },
      select: {
        id: true,
        picture: true,
        nickname: true,
        discord: true,
        userHarvestId: true,
        serverId: true,
        server: {
          select: {
            name: true,
          },
        },
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

    if (!currentUser) throw new NotFoundException();

    return {
      id: String(currentUser.id),
      picture: String(currentUser.picture),
      nickname: String(currentUser.nickname),
      discord: String(currentUser.discord),
      serverId: String(currentUser.serverId),
      server: String(currentUser.server?.name),
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
