import { ApiProperty } from '@nestjs/swagger';

export class CheckTaskRequestDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  taskId: number;
}
