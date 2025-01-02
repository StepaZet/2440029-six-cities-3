import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { isValidObjectId, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { DIName } from '../../libs/di/di.enum.js';
import { CommentRepository } from './comment-repository.interface.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { CreateCommentDto, createCommentDtoSchema } from './dto.js';
import { HttpError } from '../../libs/rest-exceptions/http-error.js';
import { Config } from '../../libs/config/config.interface.js';
import { AppSchema } from '../../libs/config/app.schema.js';
import { AuthorizeMiddleware } from '../../libs/rest/authorize.middlewate.js';
import { OfferRepository } from '../offer/offer-repository.interface.js';

@injectable()
export class CommentController extends ControllerBase {
  constructor(
    @inject(DIName.Logger) logger: Logger,
    @inject(DIName.CommentRepository) private commentRepository: CommentRepository,
    @inject(DIName.OfferRepository) private offerRepository: OfferRepository,
    @inject(DIName.Config) private readonly config: Config<AppSchema>
  ) {
    super(logger);

    this.addRoute({
      path: '/:id/comments',
      httpMethod: HttpMethod.Get,
      handleAsync: this.index.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerRepository, 'id')
      ]
    });
    this.addRoute({
      path: '/:id/comments',
      httpMethod: HttpMethod.Post,
      handleAsync: this.create.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(createCommentDtoSchema),
        new ObjectIdValidatorMiddleware(this.offerRepository, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
  }

  private async create(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const { id } = req.params;

    const dto = plainToInstance(CreateCommentDto, req.body as object);
    dto.authorId = userId;
    dto.offerId = new Types.ObjectId(id);
    const offer = await this.commentRepository.create(dto);
    this.created(res, offer);
  }

  private async index(req: Request, res: Response): Promise<void> {
    const { limit, skip } = req.query;

    const defaultLimit = 20;
    const limitValue = limit ? parseInt(limit as string, 10) : defaultLimit;

    if (isNaN(limitValue)) {
      this.sendBadRequest('limit', limit);
    }

    const defaultSkip = 0;
    const skipValue = skip ? parseInt(skip as string, 10) : defaultSkip;

    if (isNaN(skipValue)) {
      this.sendBadRequest('skip', skip);
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('offerId', id);
    }

    const result = await this.commentRepository.findAllForOffer(new Types.ObjectId(id), limitValue, skipValue);

    this.ok(res, result);
  }

  private sendBadRequest<T>(paramName: string, value: T): void {
    const error = `Wrong value for ${paramName}: ${value}`;
    throw new HttpError(StatusCodes.BAD_REQUEST, error);
  }
}
