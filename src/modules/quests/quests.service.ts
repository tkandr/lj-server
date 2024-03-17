import { and, eq, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM_TOKEN, POST_CHAIN_SERVICE_TOKEN } from 'src/constants';
import { PostChainService } from 'src/shared/services/post-chain/post-chain.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import * as schema from '@lj/drizzle/schema';

import { QuestFullResponseDto } from './dtos/quest-full.response.dto';

@Injectable()
export class QuestsService {
  private readonly logger = new Logger(QuestsService.name);

  constructor(
    @Inject(DRIZZLE_ORM_TOKEN) private db: PostgresJsDatabase<typeof schema>,
    @Inject(POST_CHAIN_SERVICE_TOKEN)
    private postChainService: PostChainService,
  ) {}

  async getQuests(): Promise<schema.IQuest[]> {
    return this.db.select().from(schema.quests);
  }

  async getFullQuestList(): Promise<QuestFullResponseDto[]> {
    return this.db.query.quests.findMany({
      with: {
        tasks: true,
      },
    });
  }

  async getFullQuest(questId: number): Promise<QuestFullResponseDto> {
    return this.db.query.quests.findFirst({
      with: {
        tasks: true,
      },
      where: eq(schema.quests.id, questId),
    });
  }

  async updateTaskStatus(taskId: number, userId: number): Promise<boolean> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) {
      throw new BadRequestException('User is not registered');
    }

    const userTask = await this.db.query.userToQuestTasks.findFirst({
      where: and(
        eq(schema.userToQuestTasks.userId, userId),
        eq(schema.userToQuestTasks.questTaskId, taskId),
      ),
    });

    if (userTask?.completedAt) {
      this.logger.warn('Checking already completed task');
      return true;
    }

    const task = await this.db.query.questTasks.findFirst({
      where: eq(schema.questTasks.id, taskId),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const taskIsCompleted = await this.checkTaskCompleted(
      task.type,
      user.address,
    );

    if (!taskIsCompleted) {
      return false;
    }

    await this.db
      .insert(schema.userToQuestTasks)
      .values({
        userId: user.id,
        questTaskId: taskId,
        startedAt: new Date(),
        completedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          schema.userToQuestTasks.userId,
          schema.userToQuestTasks.questTaskId,
        ],
        set: {
          completedAt: new Date(),
        },
      });

    const questCompleted: boolean = await this.checkQuestCompleted(
      userId,
      task.questId,
    );

    if (questCompleted) {
      await this.db
        .insert(schema.userToQuests)
        .values({
          userId,
          questId: task.questId,
          startedAt: new Date(),
          completedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [schema.userToQuests.userId, schema.userToQuests.questId],
          set: { completedAt: new Date() },
        });
    }

    return true;
  }

  private async checkTaskCompleted(
    taskType: schema.IQuestTask['type'],
    walletAddress: string,
  ): Promise<boolean> {
    switch (taskType) {
      case 'avatar_created':
        return this.postChainService.playerHasAvatar(walletAddress);
      case 'user_registration':
        return this.postChainService.playerHasAccount(walletAddress);
      default:
        throw new Error('Unknown task type');
    }
  }

  private async checkQuestCompleted(userId: number, questId: number) {
    const userQuest = await this.db.query.userToQuests.findFirst({
      where: and(
        eq(schema.userToQuests.userId, userId),
        eq(schema.userToQuests.questId, questId),
      ),
    });

    if (userQuest?.completedAt) {
      return true;
    }

    const questTasks = await this.db.query.questTasks.findMany({
      where: eq(schema.questTasks.questId, questId),
    });

    const taskIds = questTasks.map((task) => task.id);
    const userTasks = await this.db.query.userToQuestTasks.findMany({
      where: and(
        eq(schema.userToQuestTasks.userId, userId),
        inArray(schema.userToQuestTasks.questTaskId, taskIds),
      ),
    });

    if (questTasks.length !== userTasks.length) {
      return false;
    }

    const allTasksCompleted = userTasks.every((task) => !!task.completedAt);

    if (!allTasksCompleted) {
      return false;
    }

    return true;
  }
}
