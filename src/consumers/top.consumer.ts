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
import { TopMessage } from 'src/messages/top.message';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class TopConsumer {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  @MessagePattern('award.top', Transport.KAFKA)
  async totalTasks(
    @Payload() event: TopMessage,
    @Ctx() context: KafkaContext
  ) {
    if (event.rank == null || event.userId == null) {
      return;
    }

    let candidate = await this.prisma.user.findFirst({
      where: {
        id: event.userId,
      },
      include: {
        top_completion: true,
      },
    });

    if (candidate == null) {
      candidate = await this.prisma.user.create({
        data: {
          id: event.userId,
          top_completion: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          top_completion: true,
        },
      });
    }

    if (candidate.top_completion == null) {
      candidate = await this.prisma.user.update({
        where: {
          id: event.userId,
        },
        data: {
          top_completion: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          top_completion: true,
        },
      });
    }

    const result = await this.prisma.user.update({
      where: {
        id: event.userId,
      },
      data: {
        top_completion: {
          update: {
            where: {
              user_id: event.userId,
            },
            data: {
              count: event.rank,
            },
          },
        },
      },
      include: {
        top_completion: true,
      },
    });

    this.emitter.emit('top', {
      userId: event.userId,
      count: result.top_completion.count,
    });
  }
}
