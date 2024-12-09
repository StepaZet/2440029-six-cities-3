import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DIType } from '../../libs/di/di.enum.js';
import { UserEntity, UserModel } from './enteties.js';
import { UserRepository } from './user-repository.interface.js';
import { DefaultUserRepository } from './default.user-repository.js';

export function createUserContainer(): Container {
  const container = new Container();

  container.bind<UserRepository>(DIType.UserRepository).to(DefaultUserRepository).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(DIType.UserModel).toConstantValue(UserModel);

  return container;
}
