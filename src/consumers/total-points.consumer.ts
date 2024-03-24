import { Controller } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { PointsMessage } from 'src/messages/points.message';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class TotalPointsConsumer {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  @MessagePattern('award.total_points', Transport.KAFKA)
  async totalTasks(
    @Payload() event: PointsMessage,
    @Ctx() context: KafkaContext,
  ) {
    if (event.points == null || event.userId == null) {
      return;
    }

    let candidate = await this.prisma.user.findFirst({
      where: {
        id: event.userId,
      },
      include: {
        points_completion: true,
      },
    });

    if (candidate == null) {
      candidate = await this.prisma.user.create({
        data: {
          id: event.userId,
          points_completion: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          points_completion: true,
        },
      });
    }

    if (candidate.points_completion == null) {
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
          points_completion: true,
        },
      });
    }

    const result = await this.prisma.user.update({
      where: {
        id: event.userId,
      },
      data: {
        points_completion: {
          update: {
            where: {
              user_id: event.userId,
            },
            data: {
              count: candidate.points_completion.count + event.points,
            },
          },
        },
      },
      include: {
        points_completion: true,
      },
    });

    this.emitter.emit('points', {
      userId: event.userId,
      count: result.points_completion.count,
    });
  }
}
