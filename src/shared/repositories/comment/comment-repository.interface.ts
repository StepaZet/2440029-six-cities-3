import { DocumentType } from '@typegoose/typegoose';
import { UUID } from 'node:crypto';
import { CreateCommentDto } from './dto.js';
import { CommentEntity } from './enteties.js';

export interface CommentRepository {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findAllForOffer(offerId: UUID, limit: number, skip: number): Promise<DocumentType<CommentEntity>[]>;
}
