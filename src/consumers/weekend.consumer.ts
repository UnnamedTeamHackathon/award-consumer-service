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

  @MessagePattern('award.weekend', Transport.KAFKA)
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
        weekend_completion: true,
      },
    });

    if (candidate == null) {
      candidate = await this.prisma.user.create({
        data: {
          id: event.userId,
          weekend_completion: {
            create: {
              count: 0,
              last_completion: event.timestamp,
            },
          },
        },
        include: {
          weekend_completion: true,
        },
      });
    }

    if (candidate.weekend_completion == null) {
      candidate = await this.prisma.user.update({
        where: {
          id: event.userId,
        },
        data: {
          weekend_completion: {
            create: {
              count: 0,
              last_completion: event.timestamp,
            },
          },
        },
        include: {
          weekend_completion: true,
        },
      });
    }

    const tomorrow = candidate.weekend_completion.last_completion;
    tomorrow.setHours(tomorrow.getHours() + 24);

    const result = await this.prisma.user.update({
      where: {
        id: event.userId,
      },
      data: {
        weekend_completion: {
          update: {
            where: {
              user_id: event.userId,
            },
            data: {
              last_completion: event.timestamp,
              count:
                event.timestamp >= tomorrow
                  ? candidate.weekend_completion.count + 1
                  : 0,
            },
          },
        },
      },
      include: {
        weekend_completion: true,
      },
    });

    this.emitter.emit('weekend', {
      userId: event.userId,
      count: result.weekend_completion.count,
    });
  }
}
