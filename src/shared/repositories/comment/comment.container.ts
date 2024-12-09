import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Controller } from '../../libs/rest/controller.interface.js';
import { CommentController } from './comment-controller.js';
import { CommentRepository } from './comment-repository.interface.js';
import { DefaultCommentRepository } from './default.comment-repository.js';
import { CommentEntity, CommentModel } from './enteties.js';
import { DIType } from '../../libs/di/di.enum.js';

export function createCommentContainer(): Container {
  const container = new Container();

  container.bind<CommentRepository>(DIType.CommentRepository).to(DefaultCommentRepository).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(DIType.CommentModel).toConstantValue(CommentModel);
  container.bind<Controller>(DIType.CommentController).to(CommentController).inSingletonScope();

  return container;
}
