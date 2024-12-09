import { Container } from 'inversify';
import { Logger } from '../shared/libs/logging/logger.interface.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { App } from './app.js';
import { DBClient } from '../shared/libs/db/db-client.interface.js';
import { DIType } from '../shared/libs/di/di.enum.js';
import { AppSchema } from '../shared/libs/config/app.schema.js';
import { MongoDatabaseClient } from '../shared/libs/db/mongo.db-client.js';
import { AppConfig } from '../shared/libs/config/app.config.js';
import { PinoLogger } from '../shared/libs/logging/pino.logger.js';

export function createAppContainer(): Container {
  const container = new Container();

  container.bind<Logger>(DIType.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<AppSchema>>(DIType.Config).to(AppConfig).inSingletonScope();
  container.bind<App>(DIType.App).to(App).inSingletonScope();
  container.bind<DBClient>(DIType.DBClient).to(MongoDatabaseClient).inSingletonScope();

  return container;
}
