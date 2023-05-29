import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma.service';
import { ProfileController } from '../profile/profile.controller';
import { ProfileService } from '../profile/profile.service';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [PrismaService, ProfileService],
})
export class ProfileModule {}
