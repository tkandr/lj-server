import { Expose } from 'class-transformer';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class QuestEntityDto extends AbstractDto {
  @ApiResponseProperty({ type: String })
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  title: string;

  @ApiResponseProperty()
  @Expose()
  description: string;

  @ApiResponseProperty()
  @Expose()
  logoUrl: string;
}
