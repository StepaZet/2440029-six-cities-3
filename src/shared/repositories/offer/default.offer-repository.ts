import 'reflect-metadata';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { Types } from 'mongoose';
import { DIType } from '../../libs/di/di.enum.js';
import { OfferRepository } from './offer-repository.interface.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { OfferEntity } from './enteties.js';
import { CreateOfferDto } from './dto.js';

@injectable()
export class DefaultOfferRepository implements OfferRepository {
  constructor(
    @inject(DIType.Logger) private readonly logger: Logger,
    @inject(DIType.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.name}`);

    return result;
  }

  public async findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findById(id);
  }
}
