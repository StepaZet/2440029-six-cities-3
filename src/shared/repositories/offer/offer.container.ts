import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { OfferRepository } from './offer-repository.interface.js';
import { DIType } from '../../libs/di/di.enum.js';
import { DefaultOfferRepository } from './default.offer-repository.js';
import { OfferEntity, OfferModel } from './enteties.js';
import { Controller } from '../../libs/rest/controller.interface.js';
import { OfferController } from './offer-controller.js';

export function createOfferContainer(): Container {
  const container = new Container();

  container.bind<OfferRepository>(DIType.OfferRepository).to(DefaultOfferRepository).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(DIType.OfferModel).toConstantValue(OfferModel);
  container.bind<Controller>(DIType.OfferController).to(OfferController).inSingletonScope();

  return container;
}
