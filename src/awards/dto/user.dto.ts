import { ApiProperty } from '@nestjs/swagger';
import { AwardDto } from './award.dto';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    type: AwardDto,
    isArray: true,
  })
  awards: AwardDto[];
}
