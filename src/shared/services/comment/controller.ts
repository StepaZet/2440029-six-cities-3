import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { isValidObjectId, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ObjectExistingValidatorMiddleware } from '../../libs/rest-middlewares/object-id-validator.js';
import { SchemaValidatorMiddleware } from '../../libs/rest-middlewares/schema-validator.js';
import { DIName } from '../../libs/di/di.enum.js';
import { CommentRepository } from './repository/comment-repository.interface.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { CreateCommentDto, createCommentDtoSchema } from './dto.js';
import { HttpError } from '../../libs/rest-exceptions/http-error.js';
import { Config } from '../../libs/config/config.interface.js';
import { AppSchema } from '../../libs/config/app.schema.js';
import { AuthorizeMiddleware as AuthorizationMiddleware } from '../../libs/rest-middlewares/authorize.js';
import { OfferRepository } from '../offer/repository/offer-repository.interface.js';

@injectable()
export class CommentController extends ControllerBase {
  readonly prefix: string = '/offers';

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
        new ObjectExistingValidatorMiddleware(this.offerRepository, 'id')
      ]
    });
    this.addRoute({
      path: '/:id/comments',
      httpMethod: HttpMethod.Post,
      handleAsync: this.create.bind(this),
      middlewares: [
        new AuthorizationMiddleware(this.config.get('JWT_SECRET')),
        new SchemaValidatorMiddleware(createCommentDtoSchema),
        new ObjectExistingValidatorMiddleware(this.offerRepository, 'id'),
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
    const { limit, offset } = req.query;
    const { id } = req.params;

    const defaultLimit = 20;
    const limitValue = limit ? parseInt(limit as string, 10) : defaultLimit;

    const defaultOffset = 0;
    const offsetValue = offset ? parseInt(offset as string, 10) : defaultOffset;

    if (!isValidObjectId(id)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `id ${id} isn't valid ObjectId`);
    }

    const result = await this.commentRepository.findByOffer(new Types.ObjectId(id), limitValue, offsetValue);

    this.ok(res, result);
  }
}
