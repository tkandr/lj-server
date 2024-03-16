import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ApiResponseProperty } from '@nestjs/swagger';

import { QuestEntityDto } from './entities/quest.entity.dto';

export class QuestsListResponseDto {
  @ApiResponseProperty({ type: [QuestEntityDto] })
  @IsArray()
  @Type(() => QuestEntityDto)
  quests?: QuestEntityDto[];
}
