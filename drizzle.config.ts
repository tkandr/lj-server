import 'dotenv/config';

import { Config } from 'drizzle-kit';

import { pgConfigObj } from '@lj/config';

const config = {
  schema: './src/database/drizzle/schema.ts',
  out: './src/database/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: pgConfigObj.connectionString,  
  },
} satisfies Config;

export default config;
