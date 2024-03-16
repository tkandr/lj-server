import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, pgConfig } from '@lj/config';
import * as schema from '@lj/drizzle/schema';

import { NestDrizzleModule } from './database/drizzle/drizzle.module';
import { QuestsModule } from './modules/quests/quests.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, pgConfig],
    }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          options: { schema },
          migrationOptions: {
            migrationsFolder: __dirname + '/database/drizzle/migrations',
          },
        };
      },
    }),
    UsersModule,
    QuestsModule,
    SharedModule,
  ],
})
export class AppModule {}
