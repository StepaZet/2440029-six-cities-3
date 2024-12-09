import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto.js';
import { CommentEntity } from './enteties.js';
import { Types } from 'mongoose';
import { CheckIdService } from '../../libs/rest/check-id-service.interface.js';

export interface CommentRepository extends CheckIdService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findAllForOffer(offerId: Types.ObjectId, limit: number, skip: number): Promise<DocumentType<CommentEntity>[]>;
}
