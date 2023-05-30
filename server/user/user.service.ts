import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.userProgress.findMany({
      select: {
        user: true,
        missingOrExchangeable: {
          select: {
            harvest: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async updateUserProgress() {
    const result = await this.prisma.userProgress.findMany({
      where: { user: { email: 'test@test.com' } },
      select: {
        user: { select: { email: true, id: true } },
        missingOrExchangeable: {
          select: {
            amount: true,
            captured: true,
            harvest: { select: { name: true } },
          },
        },
      },
    });

    return {
      b: result.map((userProgress) => {
        return {
          user: userProgress.user,
          ...userProgress.missingOrExchangeable.reduce<
            Record<string, string[]>
          >(
            (acc, curr) => {
              if (!curr.captured) {
                acc['missing'].push(curr.harvest.name);
              } else {
                acc['repeated'].push(curr.harvest.name);
              }
              return acc;
            },
            { missing: [], repeated: [] }
          ),
        };
      }),
    };
  }
}
