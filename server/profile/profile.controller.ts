import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetProfileResponse } from '../profile/models/get-profile.response';
import { ProfileUpdateDto } from '../profile/models/profile-update.dto';
import { ProfileService } from '../profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  get(@GetUser() user: User): Promise<GetProfileResponse> {
    return this.profileService.get(user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(
    @GetUser() user: User,
    @Body() profileUpdateDto: ProfileUpdateDto
  ): Promise<void> {
    return this.profileService.update(user, profileUpdateDto);
  }
}
