import { plainToInstance } from 'class-transformer';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CheckTaskRequestDto } from './dtos/check-task.request.dto';
import { CheckTaskResponseDto } from './dtos/check-task.response.dto';
import { QuestFullResponseDto } from './dtos/quest-full.response.dto';
import { QuestsListResponseDto } from './dtos/quests-list.response.dto';
import { QuestsService } from './quests.service';

export const QUESTS_CONTROLLER_PREFIX: string = <const>'quests';

@Controller(QUESTS_CONTROLLER_PREFIX)
@ApiTags(QUESTS_CONTROLLER_PREFIX)
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: QuestsListResponseDto })
  async getQuests(): Promise<QuestsListResponseDto> {
    const quests = await this.questsService.getQuests();

    // @todo: pagination must be added here
    return plainToInstance(QuestsListResponseDto, { quests });
  }

  @Get('/:questId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: QuestFullResponseDto })
  async getFullQuest(
    @Param('questId', ParseIntPipe) questId: number,
  ): Promise<QuestFullResponseDto> {
    const quest = await this.questsService.getFullQuest(questId);

    if (!quest) {
      throw new NotFoundException('Quests not found');
    }

    return plainToInstance(QuestFullResponseDto, quest, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/check-task')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CheckTaskResponseDto })
  async checkTask(@Body() payload: CheckTaskRequestDto) {
    const taskCompleted = await this.questsService.updateTaskStatus(
      payload.taskId,
      payload.userId,
    );

    return { taskCompleted };
  }
}
