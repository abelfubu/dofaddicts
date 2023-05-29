import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  controllers: [TestController],
  providers: [PrismaService, TestService],
})
export class TestModule {}
