import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';

import {
  NEST_DRIZZLE_OPTIONS_TOKEN,
  NestDrizzleAsyncOptions,
  NestDrizzleOptions,
  NestDrizzleOptionsFactory,
} from './interfaces/drizzle.interfaces';
import {
  connectionFactory,
  createNestDrizzleProviders,
} from './drizzle.provider';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({
  providers: [DrizzleService, connectionFactory],
  exports: [DrizzleService, connectionFactory],
})
export class NestDrizzleModule {
  public static register(options: NestDrizzleOptions): DynamicModule {
    return {
      module: NestDrizzleModule,
      providers: createNestDrizzleProviders(options),
    };
  }

  public static registerAsync(options: NestDrizzleAsyncOptions): DynamicModule {
    return {
      module: NestDrizzleModule,
      providers: [...this.createProviders(options)],
    };
  }

  public static forRoot(options: NestDrizzleOptions): DynamicModule {
    const providers = createNestDrizzleProviders(options);
    return {
      module: NestDrizzleModule,
      providers: providers,
      exports: providers,
    };
  }

  public static forRootAsync(options: NestDrizzleAsyncOptions): DynamicModule {
    return {
      module: NestDrizzleModule,
      providers: [...this.createProviders(options)],
      exports: [...this.createProviders(options)],
    };
  }

  private static createProviders(options: NestDrizzleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createOptionsProvider(options)];
    }

    return [
      this.createOptionsProvider(options),
      {
        provide: options.useClass as Type<NestDrizzleOptionsFactory>,
        useClass: options.useClass as Type<NestDrizzleOptionsFactory>,
      },
    ];
  }

  private static createOptionsProvider(
    options: NestDrizzleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NEST_DRIZZLE_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: NEST_DRIZZLE_OPTIONS_TOKEN,
      useFactory: async (optionsFactory: NestDrizzleOptionsFactory) =>
        await optionsFactory.createNestDrizzleOptions(),
      inject: [
        options.useExisting || options.useClass,
      ] as Type<NestDrizzleOptionsFactory>[],
    };
  }
}
