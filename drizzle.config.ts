import 'dotenv/config';

import { defineConfig, Config } from 'drizzle-kit';

const config = defineConfig({
  schema: './src/database/drizzle/schema.ts',
  out: './src/database/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    host: process.env.PG_HOST,
    port: Number.parseInt(String(process.env.PG_PORT), 10),
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  },
} as Config);

export default config;
