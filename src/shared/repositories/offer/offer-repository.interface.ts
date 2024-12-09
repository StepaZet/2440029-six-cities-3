import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './enteties.js';
import { OfferDto, UpdateOfferDto } from './dto.js';
import { Types } from 'mongoose';
import { CityType } from '../../models/rent-offer.js';
import { CheckIdService } from '../../libs/rest/check-id-service.interface.js';

export interface OfferRepository extends CheckIdService {
  create(dto: OfferDto): Promise<DocumentType<OfferEntity>>;
  change(id: Types.ObjectId, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: Types.ObjectId): Promise<void>;
  findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null>;
  findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
  findAllPremium(city: CityType, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
  findAllFavourite(userId: Types.ObjectId, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
  addToFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;
  removeFromFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void>;
}
