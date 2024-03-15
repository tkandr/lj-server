import { IAppConfig } from 'src/config/app.config';
import { IPgConfig } from 'src/config/pg.config';

export interface IAllAppConfig {
  app: IAppConfig;
  pg: IPgConfig;
}
