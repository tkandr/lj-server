import { ApiProperty } from '@nestjs/swagger';

export class MintNftRequestDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  questId: number;
}
