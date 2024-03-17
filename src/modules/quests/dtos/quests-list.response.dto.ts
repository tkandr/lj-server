import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ApiResponseProperty } from '@nestjs/swagger';

import { QuestFullResponseDto } from './quest-full.response.dto';

export class QuestsListResponseDto {
  @ApiResponseProperty({ type: [QuestFullResponseDto] })
  @IsArray()
  @Type(() => QuestFullResponseDto)
  @Expose()
  quests?: QuestFullResponseDto[];
}
