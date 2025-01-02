import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DIName } from '../../libs/di/di.enum.js';
import { UserEntity, UserModel } from './enteties.js';
import { UserRepository } from './repository/user-repository.interface.js';
import { DefaultUserRepository } from './repository/user-repository.default.js';
import { Controller } from '../../libs/rest/controller.interface.js';
import { UserController } from './controller.js';

export function createUserContainer(): Container {
  const container = new Container();

  container.bind<UserRepository>(DIName.UserRepository).to(DefaultUserRepository).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(DIName.UserModel).toConstantValue(UserModel);
  container.bind<Controller>(DIName.UserController).to(UserController).inSingletonScope();

  return container;
}
