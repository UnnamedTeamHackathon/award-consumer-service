import { Controller } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { TaskCompletedMessage } from 'src/messages/task-completed.message';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class WeekendConsumer {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  @MessagePattern('award.daily', Transport.KAFKA)
  async totalTasks(
    @Payload() event: TaskCompletedMessage,
    @Ctx() context: KafkaContext,
  ) {
    if (
      event.valid == null ||
      event.userId == null ||
      event.timestamp == null
    ) {
      return;
    }

    let candidate = await this.prisma.user.findFirst({
      where: {
        id: event.userId,
      },
      include: {
        daily_completion: true,
      },
    });

    if (candidate == null) {
      candidate = await this.prisma.user.create({
        data: {
          id: event.userId,
          daily_completion: {
            create: {
              count: 0,
              last_completion: event.timestamp,
            },
          },
        },
        include: {
          daily_completion: true,
        },
      });
    }

    if (candidate.daily_completion == null) {
      candidate = await this.prisma.user.update({
        where: {
          id: event.userId,
        },
        data: {
          daily_completion: {
            create: {
              count: 0,
              last_completion: event.timestamp,
            },
          },
        },
        include: {
          daily_completion: true,
        },
      });
    }

    const tomorrow = candidate.daily_completion.last_completion;
    tomorrow.setHours(tomorrow.getHours() + 24);

    const result = await this.prisma.user.update({
      where: {
        id: event.userId,
      },
      data: {
        daily_completion: {
          update: {
            where: {
              user_id: event.userId,
            },
            data: {
              last_completion: event.timestamp,
              count:
                event.timestamp >= tomorrow
                  ? candidate.daily_completion.count + 1
                  : 0,
            },
          },
        },
      },
      include: {
        daily_completion: true,
      },
    });

    this.emitter.emit('daily', {
      userId: event.userId,
      count: result.daily_completion.count,
    });
  }
}
