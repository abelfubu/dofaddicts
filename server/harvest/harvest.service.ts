import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Harvest, HarvestItem, User } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { UserWithProgress } from '../user/models/user-with-progress.model';
import { HarvestUpdateItemDto } from './dtos/harvest-update-item.dto';
import { HarvestResponse, HarvestUser } from './models/harvest-response';
import { MixedHarvest } from './models/mixed-harvest';
import { RefreshResponse } from './models/refresh-response';

type UserHarvestMap = Record<string, HarvestItem>;

const HARVESTLIST: { data: Harvest[] | null } = { data: null };

@Injectable()
export class HarvestService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    { id, harvestId, captured, amount, type }: HarvestUpdateItemDto,
    user: UserWithProgress
  ): Promise<void> {
    if (!user) throw new UnauthorizedException();

    const isNew = await this.prisma.harvestItem.findFirst({
      where: { harvestId: id, userHarvestId: harvestId },
    });

    const data = {
      captured,
      amount,
      ...this.handleUserProgress(captured, amount, user.userProgress.id, type),
    };

    if (isNew) {
      await this.prisma.harvestItem.update({ where: { id: isNew.id }, data });
      return;
    }

    await this.prisma.harvestItem.upsert({
      where: { id },
      update: data,
      create: {
        userHarvestId: harvestId,
        harvestId: id,
        ...data,
      },
    });
  }

  async getAll(user: User): Promise<HarvestResponse> {
    if (!HARVESTLIST.data) {
      HARVESTLIST.data = await this.prisma.harvest.findMany();
    }

    if (!user.id)
      return {
        harvest: HARVESTLIST.data as MixedHarvest[],
        harvestId: null!,
        user: { ...user, server: null!, discord: null!, nickname: null! },
      };

    const userHarvest = await this.prisma.userHarvest.findUnique({
      where: { id: user.userHarvestId },
      include: {
        harvest: true,
        user: { select: { server: { select: { name: true } } } },
      },
    });

    const userInfo = {
      nickname: user.nickname,
      discord: user.discord,
      server: userHarvest?.user?.server?.name,
    };

    if (!userHarvest?.harvest.length)
      return {
        harvest: HARVESTLIST.data as MixedHarvest[],
        harvestId: user.userHarvestId,
        user: userInfo as HarvestUser,
      };

    const userHarvestMap = this.getUserHarvestToMap(userHarvest.harvest);

    return {
      harvest: this.getUserMixedData(HARVESTLIST.data, userHarvestMap),
      harvestId: userHarvest.id,
      user: userInfo as HarvestUser,
    };
  }

  async getHarvest(id: string): Promise<HarvestResponse> {
    if (!HARVESTLIST.data) {
      HARVESTLIST.data = await this.prisma.harvest.findMany();
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: { nickname: { equals: id, mode: 'insensitive' } },
      });

      if (user?.userHarvestId) {
        id = user.userHarvestId;
      }

      const userHarvest = await this.prisma.userHarvest.findFirst({
        where: { id },
        include: {
          harvest: true,
          user: { include: { server: { select: { name: true } } } },
        },
      });

      if (!userHarvest) throw new NotFoundException();

      const userHarvestMap = this.getUserHarvestToMap(userHarvest.harvest);

      const userInfo = {
        nickname: userHarvest!.user!.nickname!,
        discord: userHarvest!.user!.discord,
        server: userHarvest!.user!.server!.name,
      };

      return {
        harvest: this.getUserMixedData(HARVESTLIST.data, userHarvestMap),
        harvestId: null!,
        user: userInfo as HarvestUser,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async completeSteps(
    steps: number[],
    user: UserWithProgress
  ): Promise<HarvestResponse> {
    const { harvest } = await this.getAll(user);

    if (!harvest) throw new NotFoundException();

    const { captured, repeated, skip, add } = this.getCapturedAndRepeated(
      harvest,
      steps
    );

    try {
      await Promise.all([
        this.prisma.harvestItem.updateMany({
          where: { id: { in: captured } },
          data: { captured: false },
        }),
        await this.prisma.harvestItem.updateMany({
          where: { id: { in: repeated } },
          data: { amount: { decrement: 1 } },
        }),
        await this.prisma.harvestItem.updateMany({
          where: { id: { in: skip } },
          data: { userProgressId: null },
        }),
        await this.prisma.harvestItem.updateMany({
          where: { id: { in: add } },
          data: { userProgressId: user.userProgress.id },
        }),
      ]);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return await this.getAll(user);
  }

  refresh(): RefreshResponse {
    HARVESTLIST.data = null;
    return { success: true };
  }

  private getUserMixedData(
    harvest: Harvest[],
    userHarvestMap: UserHarvestMap
  ): MixedHarvest[] {
    return harvest.map((item) => {
      const exist = userHarvestMap[item.id];

      if (!exist) return item;

      return { ...item, ...userHarvestMap[item.id] } as any;
    });
  }

  private getUserHarvestToMap(harvest: HarvestItem[]): UserHarvestMap {
    return harvest.reduce<Record<string, any>>(
      (acc, { harvestId, id, captured, amount }) => {
        acc[harvestId] = { id, captured, amount };
        return acc;
      },
      {}
    );
  }

  private getCapturedAndRepeated(
    harvest: MixedHarvest[],
    steps: number[]
  ): { captured: string[]; repeated: string[]; skip: string[]; add: string[] } {
    return harvest.reduce<{
      captured: string[];
      repeated: string[];
      skip: string[];
      add: string[];
    }>(
      (acc, curr) => {
        if (!steps.includes(curr.step)) return acc;

        if (curr.amount) {
          if (curr.type === 2 && curr.amount === 1) {
            acc.skip.push(curr.id);
          }

          acc.repeated.push(curr.id);
          return acc;
        }

        acc.captured.push(curr.id);
        acc.add.push(curr.id);
        return acc;
      },
      { captured: [], repeated: [], skip: [], add: [] }
    );
  }

  private handleUserProgress(
    captured: boolean,
    amount: number,
    userProgressId: string,
    type: number
  ) {
    return captured && amount === 0 && type !== 2
      ? { userProgressId: null }
      : { userProgressId };
  }
}
