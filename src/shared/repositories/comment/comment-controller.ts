import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { isValidObjectId, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { DIType } from '../../libs/di/di.enum.js';
import { CommentRepository } from './comment-repository.interface.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { CreateCommentDto, createCommentDtoSchema } from './dto.js';
import { HttpError } from '../../libs/rest-exceptions/http-error.js';

@injectable()
export class CommentController extends ControllerBase {
  constructor(
    @inject(DIType.Logger) logger: Logger,
    @inject(DIType.CommentRepository) private commentService: CommentRepository,
  ) {
    super(logger);

    this.addRoute({path: '/:id/comments', httpMethod: HttpMethod.Get, handleAsync: this.index.bind(this), middlewares: [new ObjectIdValidatorMiddleware(this.commentService, 'id')]});
    this.addRoute({path: '/:id/comments', httpMethod: HttpMethod.Post, handleAsync: this.create.bind(this), middlewares: [new SchemaValidatorMiddleware(createCommentDtoSchema), new ObjectIdValidatorMiddleware(this.commentService, 'id')]});
  }

  private async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateCommentDto, req.body as object);
    dto.authorId = new Types.ObjectId();
    const offer = await this.commentService.create(dto);
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

    const { offerId } = req.params;

    if (!isValidObjectId(offerId)) {
      this.sendBadRequest('offerId', offerId);
    }

    const result = this.commentService.findAllForOffer(new Types.ObjectId(offerId), limitValue, skipValue);
    this.ok(res, result);
  }

  private sendBadRequest<T>(paramName: string, value: T): void {
    const error = `Wrong value for ${paramName}: ${value}`;
    throw new HttpError(StatusCodes.BAD_REQUEST, error);
  }
}
