import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompletedStepsPipe } from '../harvest/pipes/completed-step.pipe';
import { UserWithProgress } from '../user/models/user-with-progress.model';
import { HarvestUpdateItemDto } from './dtos/harvest-update-item.dto';
import { HarvestService } from './harvest.service';
import { HarvestResponse } from './models/harvest-response';
import { RefreshResponse } from './models/refresh-response';

@Controller('harvest')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@GetUser() user: User): Promise<HarvestResponse> {
    return this.harvestService.getAll(user);
  }

  @Get('refresh')
  refresh(): RefreshResponse {
    return this.harvestService.refresh();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getHarvest(@Param('id') id: string): Promise<HarvestResponse> {
    return this.harvestService.getHarvest(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  update(
    @GetUser() user: UserWithProgress,
    @Body() harvestUpdateItemDto: HarvestUpdateItemDto,
  ): Promise<void> {
    return this.harvestService.update(harvestUpdateItemDto, user);
  }

  @Post('complete')
  @UseGuards(JwtAuthGuard)
  completeSteps(
    @GetUser() user: UserWithProgress,
    @Body(CompletedStepsPipe)
    harvestCompleteStepsDto: number[],
  ): Promise<HarvestResponse> {
    return this.harvestService.completeSteps(harvestCompleteStepsDto, user);
  }

  @Get('ping')
  test(): string {
    return 'OK';
  }
}
