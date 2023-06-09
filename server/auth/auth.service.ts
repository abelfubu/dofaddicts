import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

import { PrismaService } from '../prisma.service';
import { AuthCredentialsDto } from './models/auth-credentials.dto';
import { GoogleCredentialsDto } from './models/google-credentials.dto';
import { JwtPayload } from './models/jwt-payload';
import { JwtResponse } from './models/jwt-response';
import { LoginProvider } from './models/login-provider';

const ARCHIES_IDS: string[] = [];

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async createUser({
    email,
    password,
    picture,
    provider,
  }: {
    email: string;
    password?: string;
    picture?: string;
    provider: LoginProvider;
  }): Promise<JwtResponse> {
    if (!ARCHIES_IDS.length) {
      const harvest = await this.prisma.harvest.findMany({
        where: { type: 2 },
        select: { id: true },
      });

      ARCHIES_IDS.push(...harvest.map((x) => x.id));
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: password ? await this.hashPassword(password) : 'google',
          harvest: { create: { name: 'default' } },
          ...(picture && { picture }),
          userProgress: { create: { missingOrExchangeable: { create: [] } } },
        },
        include: { userProgress: { select: { id: true } } },
      });

      console.log('USER', user);

      await this.prisma.harvestItem.createMany({
        data: ARCHIES_IDS.map((id) => ({
          harvestId: id,
          userHarvestId: user.userHarvestId,
          userProgressId: user?.userProgress?.id,
        })),
      });

      return this.generateAccessToken({
        email,
        picture,
        provider,
        nickname: null!,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async signInWithGoogle({
    credential: idToken,
  }: GoogleCredentialsDto): Promise<JwtResponse> {
    const audience = process.env['GOOGLE_CLIENT_ID'];
    const provider = LoginProvider.GOOGLE;

    try {
      const client = new OAuth2Client(audience);
      const ticket = await client.verifyIdToken({ idToken, audience });
      const { email, picture } = ticket.getPayload()!;
      const user = await this.findUser(email!);

      if (!user) return this.createUser({ email: email!, picture, provider });

      return this.generateAccessToken({
        email: email!,
        picture,
        provider,
        nickname: user.nickname!,
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async signIn({ email, password }: AuthCredentialsDto): Promise<JwtResponse> {
    const user = await this.findUser(email);
    const provider = LoginProvider.EMAIL;

    if (!user) return this.createUser({ email, password, provider });

    if (user.password === 'google') {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: await this.hashPassword(password) },
      });

      return this.generateAccessToken({
        email,
        provider,
        nickname: user.nickname!,
      });
    }

    if (!(await compare(password, user.password!)))
      throw new UnauthorizedException();

    return this.generateAccessToken({
      email,
      provider,
      picture: user.picture!,
      nickname: user.nickname!,
    });
  }

  private generateAccessToken(payload: JwtPayload): JwtResponse {
    return { accessToken: this.jwtService.sign(payload) };
  }

  private async findUser(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }
}
