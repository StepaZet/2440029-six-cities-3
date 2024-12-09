import 'reflect-metadata';
import { Container } from 'inversify';
import { DIType } from './shared/libs/di/di.enum.js';
import { App } from './rest/app.js';
import { Config } from './shared/libs/config/config.interface.js';
import { Logger } from './shared/libs/logging/logger.interface.js';
import { AppSchema } from './shared/libs/config/app.schema.js';
import { PinoLogger } from './shared/libs/logging/pino.logger.js';
import { AppConfig } from './shared/libs/config/app.config.js';

async function bootstrap() {
  const container = new Container();
  container.bind<Logger>(DIType.Looger).to(PinoLogger).inSingletonScope();
  container.bind<Config<AppSchema>>(DIType.Config).to(AppConfig).inSingletonScope();
  container.bind<App>(DIType.App).to(App).inSingletonScope();

  const app = container.get<App>(DIType.App);
  await app.init();
}

bootstrap();
