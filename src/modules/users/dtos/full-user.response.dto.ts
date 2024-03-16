import { ApiResponseProperty } from '@nestjs/swagger';

export class FullUserResponseDto {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  walletAddress: string;

  @ApiResponseProperty({
    type: [Number],
  })
  completedQuestIDs: number[];

  @ApiResponseProperty()
  points: number;
}
