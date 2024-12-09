import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './enteties.js';
import { CreateOfferDto, UpdateOfferDto } from './dto.js';
import { UUID } from 'node:crypto';

export interface OfferRepository {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  change(dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: UUID): Promise<void>;
  findById(id: UUID): Promise<DocumentType<OfferEntity> | null>;
  findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
  findAllPremium(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
  findAllFavourite(userId: UUID, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]>;
  addToFavourite(orderId: UUID, userId: UUID): Promise<void>;
  removeFromFavourite(orderId: UUID, userId: UUID): Promise<void>;
}
