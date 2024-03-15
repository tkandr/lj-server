import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  walletAddress: string;
}
