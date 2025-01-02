import 'reflect-metadata';
import { Container } from 'inversify';
import { DIName } from './shared/libs/di/di.enum.js';
import { App } from './rest/app.js';
import { createUserContainer } from './shared/repositories/user/user.container.js';
import { createOfferContainer } from './shared/repositories/offer/offer.container.js';
import { createAppContainer } from './rest/app.container.js';
import { createCommentContainer } from './shared/repositories/comment/comment.container.js';

async function bootstrap() {
  const container = Container.merge(
    createAppContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const application = container.get<App>(DIName.App);
  await application.init();
}

bootstrap();
