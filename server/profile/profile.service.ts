import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ProfileUpdateDto } from '../profile/models/profile-update.dto';
import { GetProfileResponse } from './models/get-profile.response';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get(user: User): Promise<GetProfileResponse> {
    if (!user.id) throw new UnauthorizedException();

    const servers = await this.prisma.server.findMany();

    const { password: _password, ...userWithoutPassword } = user;

    return { profile: userWithoutPassword, servers };
  }

  async update(user: User, profileUpdateDto: ProfileUpdateDto): Promise<void> {
    if (!user.id) throw new UnauthorizedException();

    const server = await this.prisma.server.findUnique({
      where: { id: profileUpdateDto.serverId },
    });

    if (!server) throw new BadRequestException();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        discord: profileUpdateDto.discord,
        nickname: profileUpdateDto.nickname,
        serverId: profileUpdateDto.serverId,
      },
    });
  }
}
