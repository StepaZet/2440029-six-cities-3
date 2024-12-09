import 'reflect-metadata';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { DIType } from '../../libs/di/di.enum.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { CommentRepository } from './comment-repository.interface.js';
import { CommentEntity } from './enteties.js';
import { OfferEntity } from '../offer/enteties.js';
import { CreateCommentDto } from './dto.js';
import { UUID } from 'node:crypto';


@injectable()
export class DefaultCommentRepository implements CommentRepository {
  constructor(
    @inject(DIType.Logger) private readonly logger: Logger,
    @inject(DIType.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(DIType.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);

    const aggregation = await this.commentModel.aggregate([{'$match': {offerId: dto.offerId}}, {'$group': {_id: null, count: {'$sum': 1}, average: {'$avg': '$rating'}}}]).exec();
    this.offerModel.findByIdAndUpdate(dto.offerId, {commentsNumber: aggregation[0].count, rating: aggregation[0].average});

    this.logger.info(`New comment created: ${result._id}`);

    return result;
  }

  public async findAllForOffer(offerId: UUID, limit: number, skip: number): Promise<DocumentType<CommentEntity>[]> {
    return await this.commentModel.find({offerId: offerId}).skip(skip).limit(limit);
  }
}
