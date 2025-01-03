import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../enteties.js';
import { OfferDto, CreateOrUpdateOfferDto } from '../dto.js';
import { Types } from 'mongoose';
import { CityType } from '../../../models/rent-offer.js';
import { CheckIdRepository } from '../../../libs/rest/check-id-repository.interface.js';

export interface OfferRepository extends CheckIdRepository {
  create(dto: OfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(id: Types.ObjectId, dto: CreateOrUpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: Types.ObjectId): Promise<void>;
  findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null>;
  findAll(limit: number, offset: number): Promise<DocumentType<OfferEntity>[]>;
  findAllPremium(city: CityType, limit: number, offset: number): Promise<DocumentType<OfferEntity>[]>;
  findAllFavourite(userId: Types.ObjectId, limit: number, offset: number): Promise<DocumentType<OfferEntity>[]>;
  addToFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;
  removeFromFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;
}
