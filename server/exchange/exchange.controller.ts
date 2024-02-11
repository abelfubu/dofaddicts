import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly service: ExchangeService) {}

  @Get('with/:username')
  @UseGuards(JwtAuthGuard)
  with(@GetUser() user: User, @Param('username') username: string) {
    return this.service.with(user, username);
  }

  @Get(':serverId')
  @UseGuards(JwtAuthGuard)
  get(@GetUser() user: User, @Param('serverId') serverId: string) {
    return this.service.get(user, serverId);
  }
}
