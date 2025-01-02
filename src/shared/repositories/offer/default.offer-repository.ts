import 'reflect-metadata';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { OfferRepository } from './offer-repository.interface.js';
import { inject, injectable } from 'inversify';
import { DIName } from '../../libs/di/di.enum.js';
import { OfferEntity } from './enteties.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { OfferDto, UpdateOfferDto } from './dto.js';
import { CityType } from '../../models/rent-offer.js';

@injectable()
export class DefaultOfferRepository implements OfferRepository {
  constructor(
    @inject(DIName.Logger) private readonly logger: Logger,
    @inject(DIName.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async checkIdExists(id: Types.ObjectId): Promise<boolean> {
    const result = await this.offerModel.findById(id);
    return Boolean(result);
  }

  public async create(dto: OfferDto): Promise<DocumentType<OfferEntity>> {
    const result = this.offerModel.create(dto);

    this.logger.info(`New offer created: ${dto.name}`);
    return result;
  }

  public async findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }

  public async change(id: Types.ObjectId, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(id, dto).exec();
    this.logger.info(`Update offer: ${result?.name}`);
    return result;
  }

  public async deleteById(id: Types.ObjectId): Promise<void> {
    const result = await this.offerModel.findByIdAndDelete(id).exec();
    this.logger.info(`Offer deleted: ${result?.name}`);
  }

  public async findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().skip(skip).limit(limit).exec();
  }

  public async findAllPremium(city: CityType, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({isPremium: true, city: city}).skip(skip).limit(limit).exec();
  }

  public async findAllFavourite(userId: Types.ObjectId, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({favouriteUsers: {'$in': [userId]}}).skip(skip).limit(limit).exec();
  }

  public async addToFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(orderId, {'$addToSet': {favouriteUsers: userId}}).exec();
  }

  public async removeFromFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(orderId, {'$pull': {favouriteUsers: userId}}).exec();
  }
}
