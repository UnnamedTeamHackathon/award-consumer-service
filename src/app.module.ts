import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TotalTaskConsumer } from './consumers/total-tasks.consumer';
import { HttpModule } from '@nestjs/axios';
import { AchievementsObserver } from './observers/achievements.observer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AwardsModule } from './awards/awards.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FlawlessConsumer } from './consumers/flawless.consumer';
import { TotalPointsConsumer } from './consumers/total-points.consumer';

@Module({
  providers: [],
  imports: [
    PrismaModule,
    HttpModule,
    EventEmitterModule.forRoot(),
    AwardsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'swagger'),
      serveStaticOptions: {},
    }),
  ],
  controllers: [
    AchievementsObserver,
    TotalTaskConsumer,
    FlawlessConsumer,
    TotalPointsConsumer,
  ],
})
export class AppModule {}
