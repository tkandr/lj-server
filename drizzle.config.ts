import 'dotenv/config';

import { Config } from 'drizzle-kit';

const config = {
  schema: './src/database/drizzle/schema.ts',
  out: './src/database/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    host: process.env.PG_HOST!,
    port: Number.parseInt(String(process.env.PG_PORT), 10),
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE!,
  },
} satisfies Config;

export default config;
