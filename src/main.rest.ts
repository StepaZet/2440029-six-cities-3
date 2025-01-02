import 'reflect-metadata';
import { Container } from 'inversify';
import { DIName } from './shared/libs/di/di.enum.js';
import { App } from './rest/app.js';
import { createUserContainer } from './shared/services/user/container.js';
import { createOfferContainer } from './shared/services/offer/container.js';
import { createAppContainer } from './rest/app.container.js';
import { createCommentContainer } from './shared/services/comment/container.js';

async function bootstrap() {
  const container = Container.merge(
    createAppContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const app = container.get<App>(DIName.App);
  await app.init();
}

bootstrap();
