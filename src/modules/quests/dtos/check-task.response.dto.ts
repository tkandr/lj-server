import { ApiProperty } from '@nestjs/swagger';

export class CheckTaskResponseDto {
  @ApiProperty()
  isCompleted: boolean;
}
