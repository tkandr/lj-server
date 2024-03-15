import { Inject, Injectable } from '@nestjs/common';
import {
  PostgresJsDatabase,
  drizzle as drizzlePgJs,
} from 'drizzle-orm/postgres-js';
import {
  NestDrizzleOptions,
  NEST_DRIZZLE_OPTIONS_TOKEN,
} from './interfaces/drizzle.interfaces';
import * as postgres from 'postgres';
import { migrate as migratePgJs } from 'drizzle-orm/postgres-js/migrator';
import { IPgConfig, pgConfig as _pgConfig } from '@lj/config';

interface IDrizzleService {
  migrate(): Promise<void>;
  getDrizzle(): Promise<PostgresJsDatabase>;
}

@Injectable()
export class DrizzleService implements IDrizzleService {
  private _drizzle: PostgresJsDatabase<Record<string, unknown>>;
  constructor(
    @Inject(_pgConfig.KEY)
    private readonly pgConfig: IPgConfig,
    @Inject(NEST_DRIZZLE_OPTIONS_TOKEN)
    private nestDrizzleOptions: NestDrizzleOptions,
  ) {}
  test(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async migrate() {
    const client = postgres(this.pgConfig.connectionString, { max: 1 });
    await migratePgJs(
      drizzlePgJs(client),
      this.nestDrizzleOptions.migrationOptions,
    );
  }
  async getDrizzle() {
    let client: postgres.Sql<Record<string, never>>;
    if (!this._drizzle) {
      client = postgres(this.pgConfig.connectionString);
      this._drizzle = drizzlePgJs(client, this.nestDrizzleOptions.options);
    }
    return this._drizzle;
  }
}