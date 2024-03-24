import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AwardsService {
  constructor(private readonly prisma: PrismaService) {}

  async complete(params: { userId: string; taskName: string }) {
    this.prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        [params.taskName]: {
          update: {
            completed: true,
          },
        },
      },
    });
  }

  async awards(params: { userId: string }): Promise<UserDto> {
    const { userId } = params;

    const candidate = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        total_tasks: true,
        top_completion: true,
        daily_completion: true,
        points_completion: true,
        weekend_completion: true,
        flawless_completion: true,
      },
    });

    const dto: UserDto = {
      id: userId,
      awards: [],
    };

    if (candidate == null) {
      return dto;
    }

    if (candidate.total_tasks != null) {
      dto.awards.push({
        name: 'Решала',
        status: candidate.total_tasks.count,
        completed: candidate.total_tasks.completed,
      });
    }

    if (candidate.points_completion != null) {
      dto.awards.push({
        name: 'Мудрец',
        status: candidate.points_completion.count,
        completed: candidate.points_completion.completed,
      });
    }

    if (candidate.weekend_completion != null) {
      dto.awards.push({
        name: 'Воин выходного дня',
        status: candidate.weekend_completion.count,
        completed: candidate.weekend_completion.completed,
      });
    }

    if (candidate.daily_completion != null) {
      dto.awards.push({
        name: 'Энтузиаст',
        status: candidate.daily_completion.count,
        completed: candidate.daily_completion.completed,
      });
    }

    if (candidate.flawless_completion != null) {
      dto.awards.push({
        name: 'Снайпер',
        status: candidate.flawless_completion.count,
        completed: candidate.flawless_completion.completed,
      });
    }

    if (candidate.top_completion != null) {
      dto.awards.push({
        name: 'Лидер',
        status: candidate.top_completion.count,
        completed: candidate.top_completion.completed,
      });
    }

    return dto;
  }
}
