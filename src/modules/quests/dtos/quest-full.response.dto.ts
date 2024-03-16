import { Expose, Type } from 'class-transformer';
import { ApiResponseProperty } from '@nestjs/swagger';

import { QuestEntityDto } from './entities/quest.entity.dto';
import { QuestTaskEntityDto } from './entities/quest-task.entity.dto';

export class QuestFullResponseDto extends QuestEntityDto {
  @ApiResponseProperty({ type: [QuestTaskEntityDto] })
  @Type(() => QuestTaskEntityDto)
  @Expose()
  tasks: QuestTaskEntityDto[];
}
