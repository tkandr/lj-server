import { relations } from 'drizzle-orm';
import {
  customType,
  integer,
  pgTable,
  PgTimestampConfig,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// ==== Custom types ====
const timestampz = (name: string, options: PgTimestampConfig = {}) =>
  timestamp(name, { withTimezone: true, mode: 'date', ...options });

const timestampzDefaultNow = (name: string, options: PgTimestampConfig = {}) =>
  timestampz(name, options).defaultNow().notNull();

const walletAddress = customType<{ data: string }>({
  dataType() {
    // for now we support only EVM addresses
    return 'char(42)';
  },
  toDriver(value: string): string {
    return value.toLowerCase();
  },
});

// ==== Tables ====
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(), // wallet address can be used as primary key, but unsorted keys are bed for performance
    createdAt: timestampzDefaultNow('created_at'),
    lastLogin: timestampz('last_login'),
    address: walletAddress('address').notNull(),
  },
  (table) => ({
    addressIdx: uniqueIndex('address_idx').on(table.address),
  }),
);

export const quests = pgTable('quests', {
  id: serial('id').primaryKey(),
  createdAt: timestampzDefaultNow('created_at'),
  title: text('title').notNull(),
  description: text('description').notNull(),
  logoUrl: text('logo_url'),
});

export const questTasks = pgTable('quest_tasks', {
  id: serial('id').primaryKey(),
  questId: serial('quest_id')
    .notNull()
    .references(() => quests.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  points: integer('points').notNull(),
  type: varchar('type', {
    enum: ['user_registration', 'avatar_created'],
  }).notNull(),
});

// Enum code usage example
// const taskType: QuestTask['type'] = 'user_registration';

export const userToQuests = pgTable(
  'user_to_quests',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    questId: integer('quest_id')
      .notNull()
      .references(() => quests.id),
    startedAt: timestampzDefaultNow('started_at'),
    completedAt: timestampz('completed_at'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.questId] }),
  }),
);

export const userToQuestTasks = pgTable(
  'user_to_quest_tasks',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    questTaskId: integer('quest_task_id')
      .notNull()
      .references(() => questTasks.id),
    startedAt: timestampzDefaultNow('started_at'),
    completedAt: timestampz('completed_at'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.questTaskId] }),
  }),
);

// ==== Relations ====
export const questsRelations = relations(quests, ({ many }) => ({
  tasks: many(questTasks),
  usersToQuests: many(userToQuests),
}));

export const questTasksRelations = relations(questTasks, ({ one }) => ({
  quest: one(quests, {
    fields: [questTasks.questId],
    references: [quests.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  usersToQuests: many(userToQuests),
  usersToQuestTasks: many(userToQuestTasks),
}));

export const userToQuestsRelations = relations(userToQuests, ({ one }) => ({
  user: one(users, {
    fields: [userToQuests.userId],
    references: [users.id],
  }),
  quest: one(quests, {
    fields: [userToQuests.questId],
    references: [quests.id],
  }),
}));

export const userToQuestTasksRelations = relations(
  userToQuestTasks,
  ({ one }) => ({
    user: one(users, {
      fields: [userToQuestTasks.userId],
      references: [users.id],
    }),
    questTask: one(questTasks, {
      fields: [userToQuestTasks.questTaskId],
      references: [questTasks.id],
    }),
  }),
);

// ==== Typings ====
export type IUser = typeof users.$inferSelect;
export type IQuest = typeof quests.$inferSelect;
export type IQuestTask = typeof questTasks.$inferSelect;
export type INewUser = typeof users.$inferInsert;
export type INewQuest = typeof quests.$inferInsert;
export type INewQuestTask = typeof questTasks.$inferInsert;
