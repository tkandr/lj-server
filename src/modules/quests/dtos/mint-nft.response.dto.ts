import { ApiProperty } from '@nestjs/swagger';

export class MintNftResponseDto {
  @ApiProperty()
  signature: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  contractAddress: string;
}
