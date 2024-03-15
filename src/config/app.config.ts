import { get } from 'env-var';
import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  nodeEnv: string;
  port: number;
  host: string;
  apiPrefix: string;
}

export const appConfig = registerAs<IAppConfig>('app', () => ({
  nodeEnv: get('NODE_ENV')
    .default('development')
    .asEnum(['development', 'production', 'test']),
  port: get('APP_PORT').default(3000).asPortNumber(),
  host: get('APP_HOST').default('localhost').asString(),
  apiPrefix: get('API_PREFIX').default('api').asString(),
}));
