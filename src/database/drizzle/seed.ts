import 'dotenv/config';
import { pgConfigObj } from '@lj/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { quests, questTasks } from './schema';

const main = async () => {
  const client = postgres(pgConfigObj.connectionString, { max: 1 });

  const db = drizzle(client);

  const [aliceQuest] = await db
    .insert(quests)
    .values({
      title: 'My Neighbor Alice',
      description: 'Help My Neighbor Alice',
    })
    .returning();

  await db.insert(questTasks).values([
    {
      questId: aliceQuest.id,
      title: 'Register',
      description: 'Register to the game',
      reward: 10,
      type: 'user_registration',
    },
    {
      questId: aliceQuest.id,
      title: 'Create avatar',
      description: 'Create an avatar',
      reward: 20,
      type: 'avatar_created',
    },
  ]);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding done!');
    process.exit(0);
  });