import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Controller } from '../../libs/rest/controller.interface.js';
import { CommentController } from './controller.js';
import { CommentRepository } from './repository/comment-repository.interface.js';
import { DefaultCommentRepository } from './repository/comment-repository.default.js';
import { CommentEntity, CommentModel } from './enteties.js';
import { DIName } from '../../libs/di/di.enum.js';

export function createCommentContainer(): Container {
  const container = new Container();

  container.bind<CommentRepository>(DIName.CommentRepository).to(DefaultCommentRepository).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(DIName.CommentModel).toConstantValue(CommentModel);
  container.bind<Controller>(DIName.CommentController).to(CommentController).inSingletonScope();

  return container;
}
