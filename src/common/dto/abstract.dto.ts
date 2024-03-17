import { Expose } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ApiResponseProperty } from '@nestjs/swagger';

export class AbstractDto {
  @ApiResponseProperty()
  @Expose()
  @IsInt()
  id: number;
}
