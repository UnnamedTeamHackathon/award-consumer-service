import { Controller, Injectable } from '@nestjs/common';
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
export class TotalTaskConsumer {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  // надо бы дженерики... но как-то хочется спать...
  @MessagePattern('award.total_tasks', Transport.KAFKA)
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
        total_tasks: true,
      },
    });

    if (candidate == null) {
      candidate = await this.prisma.user.create({
        data: {
          id: event.userId,
          total_tasks: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          total_tasks: true,
        },
      });
    }

    if (candidate.total_tasks == null) {
      candidate = await this.prisma.user.update({
        where: {
          id: event.userId,
        },
        data: {
          points_completion: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          total_tasks: true,
        },
      });
    }

    const result = await this.prisma.user.update({
      where: {
        id: event.userId,
      },
      data: {
        total_tasks: {
          update: {
            where: {
              user_id: event.userId,
            },
            data: {
              count: candidate.total_tasks.count + 1,
            },
          },
        },
      },
      include: {
        total_tasks: true,
      },
    });

    this.emitter.emit('task.completed', {
      userId: event.userId,
      count: result.total_tasks.count,
    });
  }
}
