import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM_TOKEN } from 'src/constants';

import { NEST_DRIZZLE_OPTIONS_TOKEN } from './interfaces/drizzle.interfaces';
import { NestDrizzleOptions } from './interfaces/drizzle.interfaces';
import { DrizzleService } from './drizzle.service';

export const connectionFactory = {
  provide: DRIZZLE_ORM_TOKEN,
  useFactory: async (nestDrizzleService: {
    getDrizzle: () => Promise<PostgresJsDatabase>;
  }) => {
    return nestDrizzleService.getDrizzle();
  },
  inject: [DrizzleService],
};

export function createNestDrizzleProviders(options: NestDrizzleOptions) {
  return [
    {
      provide: NEST_DRIZZLE_OPTIONS_TOKEN,
      useValue: options,
    },
  ];
}
