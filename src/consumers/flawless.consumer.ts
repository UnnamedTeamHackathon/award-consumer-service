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
export class FlawlessConsumer {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  @MessagePattern('award.flawless', Transport.KAFKA)
  async totalTasks(
    @Payload() event: TaskCompletedMessage,
    @Ctx() context: KafkaContext,
  ) {
    if (event.valid == null || event.userId == null) {
      return;
    }

    let candidate = await this.prisma.user.findFirst({
      where: {
        id: event.userId,
      },
      include: {
        flawless_completion: true,
      },
    });

    if (candidate == null) {
      candidate = await this.prisma.user.create({
        data: {
          id: event.userId,
          flawless_completion: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          flawless_completion: true,
        },
      });
    }

    if (candidate.flawless_completion == null) {
      candidate = await this.prisma.user.update({
        where: {
          id: event.userId,
        },
        data: {
          flawless_completion: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          flawless_completion: true,
        },
      });
    }

    const result = await this.prisma.user.update({
      where: {
        id: event.userId,
      },
      data: {
        flawless_completion: {
          update: {
            where: {
              user_id: event.userId,
            },
            data: {
              count: event.valid ? candidate.flawless_completion.count + 1 : 0,
            },
          },
        },
      },
      include: {
        flawless_completion: true,
      },
    });

    this.emitter.emit('flawless', {
      userId: event.userId,
      count: result.flawless_completion.count,
    });
  }
}
