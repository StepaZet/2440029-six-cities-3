import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { OfferRepository } from './repository/offer-repository.interface.js';
import { DIName } from '../../libs/di/di.enum.js';
import { DefaultOfferRepository } from './repository/offer-repository.default.js';
import { OfferEntity, OfferModel } from './enteties.js';
import { Controller } from '../../libs/rest/controller.interface.js';
import { OfferController } from './controller.js';

export function createOfferContainer(): Container {
  const container = new Container();

  container.bind<OfferRepository>(DIName.OfferRepository).to(DefaultOfferRepository).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(DIName.OfferModel).toConstantValue(OfferModel);
  container.bind<Controller>(DIName.OfferController).to(OfferController).inSingletonScope();

  return container;
}
