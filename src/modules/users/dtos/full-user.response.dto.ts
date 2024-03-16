import { AbstractDto } from 'src/common/dto/abstract.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class FullUserResponseDto extends AbstractDto {
  @ApiResponseProperty()
  walletAddress: string;

  @ApiResponseProperty({
    type: [Number],
  })
  completedQuestIDs: number[];

  @ApiResponseProperty()
  points: number;
}
