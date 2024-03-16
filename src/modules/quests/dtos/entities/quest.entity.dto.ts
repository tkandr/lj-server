import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class QuestEntityDto extends AbstractDto {
  @ApiResponseProperty()
  @Expose()
  createdAt: string;

  @ApiResponseProperty()
  @Expose()
  title: string;

  @ApiResponseProperty()
  @Expose()
  description: number;

  @ApiResponseProperty()
  @Expose()
  logoUrl: string;
}
