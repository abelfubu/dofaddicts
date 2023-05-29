import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';
import AppServerModule from '../src/main.server';
import { AuthModule } from './auth/auth.module';
import { ExchangeModule } from './exchange/exchange.module';
import { HarvestModule } from './harvest/harvest.module';
import { ProfileModule } from './profile/profile.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    TestModule,
    AuthModule,
    ExchangeModule,
    HarvestModule,
    ProfileModule,
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/dofaddicts/browser'),
    }),
  ],
})
export class AppModule {}
