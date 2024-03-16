import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class QuestTaskEntityDto extends AbstractDto {
  @ApiResponseProperty()
  @Expose()
  title: string;

  @ApiResponseProperty()
  @Expose()
  description: number;

  @ApiResponseProperty()
  @Expose()
  points: string;
}
