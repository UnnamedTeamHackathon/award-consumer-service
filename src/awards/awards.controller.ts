import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { AwardsService } from './awards.service';

@Controller('awards')
export class AwardsController {
  constructor(private readonly award: AwardsService) {}
  @ApiOkResponse({
    isArray: true,
    type: UserDto,
  })
  @Get('/user/:id')
  async getAwards(@Param('id', ParseUUIDPipe) id: string) {
    return this.award.awards({ userId: id });
  }
}
