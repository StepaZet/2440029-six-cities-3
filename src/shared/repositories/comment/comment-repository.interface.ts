import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto.js';
import { CommentEntity } from './enteties.js';
import { Types } from 'mongoose';
import { CheckIdRepository } from '../../libs/rest/check-id-repository.interface.js';

export interface CommentRepository extends CheckIdRepository {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findAllForOffer(offerId: Types.ObjectId, limit: number, skip: number): Promise<DocumentType<CommentEntity>[]>;
}
