import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM_TOKEN } from 'src/constants';
import { Inject, Injectable } from '@nestjs/common';

import * as schema from '@lj/drizzle/schema';

import { FullUserResponseDto } from './dtos/full-user.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_ORM_TOKEN) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async loginOrRegisterUser(address: string): Promise<schema.IUser> {
    const [user] = await this.db
      .insert(schema.users)
      .values({ address, lastLogin: new Date() })
      .onConflictDoUpdate({
        target: schema.users.address,
        set: { lastLogin: new Date() },
      })
      .returning();

    return user;
  }

  async getFullUser(address: string): Promise<FullUserResponseDto> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.address, address));

    const completedQuests = await this.db
      .select({ id: schema.userToQuests.questId })
      .from(schema.userToQuests)
      .where(
        and(
          eq(schema.userToQuests.userId, user.id),
          isNotNull(schema.userToQuests.completedAt),
        ),
      );

    const [{ points }] = await this.db
      .select({
        points: sql<number>`cast(count(${schema.questTasks.points}) as int)`,
      })
      .from(schema.userToQuestTasks)
      .leftJoin(
        schema.questTasks,
        eq(schema.userToQuestTasks.questTaskId, schema.questTasks.id),
      );

    return {
      id: user.id,
      walletAddress: user.address,
      completedQuestIDs: completedQuests.map((quest) => quest.id),
      points,
    };
  }
}
