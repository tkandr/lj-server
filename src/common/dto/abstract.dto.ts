import { ApiResponseProperty } from '@nestjs/swagger';

export class AbstractDto {
  @ApiResponseProperty()
  id: number;
}
