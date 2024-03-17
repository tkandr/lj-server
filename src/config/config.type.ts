import { IAppConfig } from './app.config';
import { IPgConfig } from './pg.config';
import { ISbtConfig } from './sbt.config';

export interface IAllAppConfig {
  app: IAppConfig;
  pg: IPgConfig;
  sbt: ISbtConfig;
}
