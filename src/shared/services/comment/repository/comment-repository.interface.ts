import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from '../dto.js';
import { CommentEntity } from '../enteties.js';
import { Types } from 'mongoose';
import { CheckIdRepository } from '../../../libs/rest/check-id-repository.interface.js';

export interface CommentRepository extends CheckIdRepository {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOffer(offerId: Types.ObjectId, limit: number, offset: number): Promise<DocumentType<CommentEntity>[]>;
}
