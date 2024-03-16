import { relations } from 'drizzle-orm';
import {
  char,
  index,
  integer,
  pgTable,
  PgTimestampConfig,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

const timestampz = (name: string, options: PgTimestampConfig = {}) =>
  timestamp(name, { ...options, withTimezone: true });

const timestampzDefaultNow = (name: string, options: PgTimestampConfig = {}) =>
  timestampz(name, options).defaultNow().notNull();

// ==== Tables ====
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(), // wallet address can be used as primary key, but unsorted keys are bed for performance
    createdAt: timestampzDefaultNow('created_at'),
    lastLogin: timestampz('last_login'),
    address: char('address', { length: 42 }).notNull(),
  },
  (table) => ({
    addressIdx: index('address_idx').on(table.address),
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
  reward: integer('reward').notNull(),
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

export const userToQuestTasks = pgTable('user_to_quest_tasks', {
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  questTaskId: integer('quest_task_id')
    .notNull()
    .references(() => questTasks.id),
  startedAt: timestampz('started_at'),
  completedAt: timestampz('completed_at'),
});

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
export type User = typeof users.$inferSelect;
export type Quest = typeof quests.$inferSelect;
export type QuestTask = typeof questTasks.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type NewQuest = typeof quests.$inferInsert;
export type NewQuestTask = typeof questTasks.$inferInsert;
