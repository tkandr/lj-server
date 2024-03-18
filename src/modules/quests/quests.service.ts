import { and, eq, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM_TOKEN, POST_CHAIN_SERVICE_TOKEN } from 'src/constants';
import { PostChainService } from 'src/shared/services/post-chain/post-chain.service';
import { SbtService } from 'src/shared/services/sbt/sbt.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import * as schema from '@lj/drizzle/schema';

import { MintNftResponseDto } from './dtos/mint-nft.response.dto';
import { QuestFullResponseDto } from './dtos/quest-full.response.dto';

@Injectable()
export class QuestsService {
  private readonly logger = new Logger(QuestsService.name);

  constructor(
    @Inject(DRIZZLE_ORM_TOKEN) private db: PostgresJsDatabase<typeof schema>,
    @Inject(POST_CHAIN_SERVICE_TOKEN)
    private postChainService: PostChainService,
    private readonly sbtService: SbtService,
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

  /**
   * Check if user completed task and complete it if so.
   * Completes quest if all the tasks were completed
   */
  async tryCompleteTask(taskId: number, userId: number): Promise<boolean> {
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

    // If task is completed and quest completition fails, we should rollback or the quest will never be completed
    await this.db.transaction(async (trx) => {
      const questId = task.questId;

      // Complete task
      await trx
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

      const userQuest = await trx.query.userToQuests.findFirst({
        where: and(
          eq(schema.userToQuests.userId, userId),
          eq(schema.userToQuests.questId, questId),
        ),
      });

      if (userQuest?.completedAt) {
        // The task was not completed, but the quest was already completed
        // Should never happen
        this.logger.warn(
          `The quest ${questId} was completed before all task were completed`,
        );
        return;
      }

      const questTasks = await trx.query.questTasks.findMany({
        where: eq(schema.questTasks.questId, questId),
      });

      const taskIds = questTasks.map((task) => task.id);
      const userTasks = await trx.query.userToQuestTasks.findMany({
        where: and(
          eq(schema.userToQuestTasks.userId, userId),
          inArray(schema.userToQuestTasks.questTaskId, taskIds),
        ),
      });

      if (questTasks.length !== userTasks.length) {
        return;
      }

      const questCompleted = userTasks.every((task) => !!task.completedAt);

      if (!questCompleted) {
        return;
      }

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
    });

    return true;
  }

  public async getDataForNftMint(
    userId: number,
    questId: number,
  ): Promise<MintNftResponseDto> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) {
      throw new BadRequestException('User is not registered');
    }

    const canMint = await this.allowedToMintNft(userId, questId);

    if (!canMint) {
      throw new BadRequestException('User is not allowed to mint NFT');
    }

    const message = await this.sbtService.getSingerMessage(user.address);

    return message;
  }
  /**
   * If only one task is completed, the user is allowed to mint the NFT
   */
  private async allowedToMintNft(
    userId: number,
    questId: number,
  ): Promise<boolean> {
    const subQuery = this.db
      .select({ id: schema.questTasks.id })
      .from(schema.questTasks)
      .where(eq(schema.questTasks.questId, questId));

    const userQuestTasks = await this.db
      .select({ completedAt: schema.userToQuestTasks.completedAt })
      .from(schema.userToQuestTasks)
      .where(
        and(
          eq(schema.userToQuestTasks.userId, userId),
          inArray(schema.userToQuestTasks.questTaskId, subQuery),
        ),
      );

    // At least one task is enough
    return userQuestTasks.some((task) => task.completedAt);
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
}
