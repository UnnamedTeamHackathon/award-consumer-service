import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AwardsService } from 'src/awards/awards.service';
import { FlawlessEvent } from 'src/events/flawless.event';
import { PointsEvent } from 'src/events/points.event';
import { TaskCompletedEvent } from 'src/events/task-completed.event';
import { TopEvent } from 'src/events/top.event';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class AchievementsObserver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awards: AwardsService,
  ) {}

  @OnEvent('task.completed')
  async taskCompleted(event: TaskCompletedEvent) {
    if (event.count >= 100) {
      await this.awards.complete({
        userId: event.userId,
        taskName: 'total_tasks',
      });
    }
  }

  @OnEvent('flawless')
  async flawless(event: FlawlessEvent) {
    if (event.count >= 7) {
      await this.awards.complete({
        userId: event.userId,
        taskName: 'flawless_completion',
      });
    }
  }

  @OnEvent('points')
  async points(event: PointsEvent) {
    if (event.count >= 1000) {
      await this.awards.complete({
        userId: event.userId,
        taskName: 'points_completion',
      });
    }
  }

  @OnEvent('top')
  async top(event: TopEvent) {
    if (event.rank != 0 && event.rank <= 10) {
      await this.awards.complete({
        userId: event.userId,
        taskName: 'top_completion',
      });
    }
  }

  @OnEvent('daily')
  async daily(event: TaskCompletedEvent) {
    if (event.count >= 7) {
      await this.awards.complete({
        userId: event.userId,
        taskName: 'daily_completion',
      });
    }
  }

  @OnEvent('weekend')
  async weekend(event: TaskCompletedEvent) {
    if (event.count == 2) {
      await this.awards.complete({
        userId: event.userId,
        taskName: 'weekend_completion',
      });
    }
  }
}
