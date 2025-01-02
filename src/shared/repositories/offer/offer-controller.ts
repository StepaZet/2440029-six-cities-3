import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { isValidObjectId, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { DIName } from '../../libs/di/di.enum.js';
import { OfferRepository } from './offer-repository.interface.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { CityType } from '../../models/rent-offer.js';
import { HttpError } from '../../libs/rest-exceptions/http-error.js';
import { OfferDto, updateOfferDtoSchema } from './dto.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { AppSchema } from '../../libs/config/app.schema.js';
import { Config } from '../../libs/config/config.interface.js';
import { AuthorizeMiddleware } from '../../libs/rest/authorize.middlewate.js';

@injectable()
export class OfferController extends ControllerBase {
  constructor(
    @inject(DIName.Logger) logger: Logger,
    @inject(DIName.OfferRepository) private offerRepository: OfferRepository,
    @inject(DIName.Config) private readonly config: Config<AppSchema>
  ) {
    super(logger);
    this.addRoute({
      path: '/premium/:city',
      httpMethod: HttpMethod.Get,
      handleAsync: this.indexPremiumForCity.bind(this)
    });

    this.addRoute({
      path: '/favourite',
      httpMethod: HttpMethod.Get,
      handleAsync: this.indexFavouriteForUser.bind(this),
      middlewares: [
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/favourite/:id',
      httpMethod: HttpMethod.Post,
      handleAsync: this.addToFavourite.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerRepository, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/favourite/:id',
      httpMethod: HttpMethod.Delete,
      handleAsync: this.removeFromFavourite.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerRepository, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });

    this.addRoute({
      path: '/',
      httpMethod: HttpMethod.Get,
      handleAsync: this.index.bind(this)
    });
    this.addRoute({
      path: '/',
      httpMethod: HttpMethod.Post,
      handleAsync: this.create.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(updateOfferDtoSchema),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/:id',
      httpMethod: HttpMethod.Get,
      handleAsync: this.showById.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerRepository, 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      httpMethod: HttpMethod.Put,
      handleAsync: this.updateById.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(updateOfferDtoSchema),
        new ObjectIdValidatorMiddleware(this.offerRepository, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
    this.addRoute({
      path: '/:id',
      httpMethod: HttpMethod.Delete,
      handleAsync: this.deleteById.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.offerRepository, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET'))
      ]
    });
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

    const offers = await this.offerRepository.findAll(limitValue, skipValue);
    this.ok(res, offers);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const dto = plainToInstance(OfferDto, req.body as object);
    dto.authorId = userId;
    const offer = await this.offerRepository.create(dto);
    this.created(res, offer);
  }

  private async showById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const offer = await this.offerRepository.findById(new Types.ObjectId(id));
    this.ok(res, offer);
  }

  private async updateById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const { userId } = res.locals;
    const offerId = new Types.ObjectId(id);

    const offerFromDb = await this.offerRepository.findById(offerId);

    if (offerFromDb?.authorId !== userId) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'No access to update offer');
    }

    const dto = plainToInstance(OfferDto, req.body);
    const offer = await this.offerRepository.change(new Types.ObjectId(id), dto);
    this.ok(res, offer);
  }

  private async deleteById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const { userId } = res.locals;
    const offerId = new Types.ObjectId(id);

    const offer = await this.offerRepository.findById(offerId);
    if (offer?.authorId !== userId) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'No access to delete offer');
    }

    await this.offerRepository.deleteById(offerId);

    this.noContent(res);
  }

  private async indexPremiumForCity(req: Request, res: Response): Promise<void> {
    const { city } = req.params;

    const cityValue = city as CityType;
    if (!cityValue) {
      this.sendBadRequest('city', city);
    }

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

    const offers = await this.offerRepository.findAllPremium(cityValue, limitValue, skipValue);
    this.ok(res, offers);
  }

  private async indexFavouriteForUser(req: Request, res: Response): Promise<void> {
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

    const { userId } = res.locals;

    const offers = await this.offerRepository.findAllFavourite(userId, limitValue, skipValue);
    this.ok(res, offers);
  }

  private async addToFavourite(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    await this.offerRepository.addToFavourite(new Types.ObjectId(id), userId);
    this.ok(res, null);
  }

  private async removeFromFavourite(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    await this.offerRepository.removeFromFavourite(new Types.ObjectId(id), userId);
    this.ok(res, null);
  }

  private sendBadRequest<T>(paramName: string, value: T): void {
    const error = `Wrong value for ${paramName}: ${value}`;
    throw new HttpError(StatusCodes.BAD_REQUEST, error);
  }
}
