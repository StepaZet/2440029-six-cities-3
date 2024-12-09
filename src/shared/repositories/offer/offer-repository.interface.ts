import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { OfferEntity } from './enteties.js';
import { CreateOfferDto } from './dto.js';

export interface OfferRepository {
  create(schema: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null>;
}
