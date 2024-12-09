import 'reflect-metadata';
import { Container } from 'inversify';
import { DIType } from './shared/libs/di/di.enum.js';
import { App } from './rest/app.js';
import { createUserContainer } from './shared/repositories/user/user.container.js';
import { createOfferContainer } from './shared/repositories/offer/offer.container.js';
import { createAppContainer } from './rest/app.container.js';

async function bootstrap() {
  const container = Container.merge(
    createAppContainer(),
    createUserContainer(),
    createOfferContainer()
  );

  const application = container.get<App>(DIType.App);
  await application.init();
}

bootstrap();
