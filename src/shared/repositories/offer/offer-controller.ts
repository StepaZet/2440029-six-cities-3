import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { isValidObjectId, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { DIType } from '../../libs/di/di.enum.js';
import { OfferRepository } from './offer-repository.interface.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { CityType } from '../../models/rent-offer.js';
import { HttpError } from '../../libs/rest-exceptions/http-error.js';
import { OfferDto } from './dto.js';

@injectable()
export class OfferController extends ControllerBase {
  constructor(
    @inject(DIType.Logger) logger: Logger,
    @inject(DIType.OfferRepository) private offerRepository: OfferRepository,
  ) {
    super(logger);
    this.addRoute({path: '/premium/:city', httpMethod: HttpMethod.Delete, handleAsync: this.getPremiumOffersForCityAsync.bind(this)});

    this.addRoute({path: '/favourite', httpMethod: HttpMethod.Get, handleAsync: this.getFavouriteOffersForUserAsync.bind(this)});
    this.addRoute({path: '/favourite/:id', httpMethod: HttpMethod.Post, handleAsync: this.addOfferToFavouriteAsync.bind(this)});
    this.addRoute({path: '/favourite/:id', httpMethod: HttpMethod.Delete, handleAsync: this.removeOfferFromFavouriteAsync.bind(this)});

    this.addRoute({path: '/', httpMethod: HttpMethod.Get, handleAsync: this.getOffersAsync.bind(this)});
    this.addRoute({path: '/', httpMethod: HttpMethod.Post, handleAsync: this.createOfferAsync.bind(this)});
    this.addRoute({path: '/:id', httpMethod: HttpMethod.Get, handleAsync: this.findOfferByIdAsync.bind(this)});
    this.addRoute({path: '/:id', httpMethod: HttpMethod.Put, handleAsync: this.changeOfferByIdAsync.bind(this)});
    this.addRoute({path: '/:id', httpMethod: HttpMethod.Delete, handleAsync: this.deleteOfferById.bind(this)});
  }

  private async getOffersAsync(req: Request, res: Response): Promise<void> {
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

  private async createOfferAsync(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(OfferDto, req.body as object);
    dto.authorId = new Types.ObjectId();
    const offer = await this.offerRepository.create(dto);
    this.created(res, offer);
  }

  private async findOfferByIdAsync(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const offer = await this.offerRepository.findById(new Types.ObjectId(id));
    this.ok(res, offer);
  }

  private async changeOfferByIdAsync(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    const dto = plainToInstance(OfferDto, req.body);
    const offer = await this.offerRepository.change(new Types.ObjectId(id), dto);
    this.ok(res, offer);
  }

  private async deleteOfferById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      this.sendBadRequest('id', id);
    }

    await this.offerRepository.deleteById(new Types.ObjectId(id));
    this.noContent(res);
  }

  private async getPremiumOffersForCityAsync(req: Request, res: Response): Promise<void> {
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

  private async getFavouriteOffersForUserAsync(_req: Request, _res: Response): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async addOfferToFavouriteAsync(_req: Request, _res: Response): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async removeOfferFromFavouriteAsync(_req: Request, _res: Response): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private sendBadRequest<T>(paramName: string, value: T): void {
    const error = `Wrong value for ${paramName}: ${value}`;
    throw new HttpError(StatusCodes.BAD_REQUEST, error);
  }
}
