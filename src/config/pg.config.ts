import { get } from 'env-var';
import { registerAs } from '@nestjs/config';

export interface IPgConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  logging: boolean;
  connectionString: string;
}

export const pgConfig = registerAs<IPgConfig>('pg', () => ({
  host: get('PG_HOST').required().asString(),
  port: get('PG_PORT').required().asPortNumber(),
  database: get('PG_DATABASE').required().asString(),
  username: get('PG_USERNAME').required().asString(),
  password: get('PG_PASSWORD').required().asString(),
  logging: get('PG_LOGGING').default('false').asBoolStrict(),
  get connectionString() {
    return `postgres://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
  },
}));
