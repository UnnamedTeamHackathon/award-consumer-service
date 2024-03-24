import { ApiProperty } from '@nestjs/swagger';

export class AwardDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  completed: boolean;
}