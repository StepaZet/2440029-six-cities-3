
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { CheckIdService } from './check-id-service.interface.js';
import { HttpError } from '../rest-exceptions/http-error.js';

export class ObjectIdValidatorMiddleware implements Middleware {
  constructor(
    private service: CheckIdService,
    private param: string
  ) {}

  public async handleAsync(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const value = req.params[this.param];

    if (!isValidObjectId(value)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${this.param} is invalid ObjectID`
      );
    }

    const objectId = Types.ObjectId.createFromHexString(value);
    if (!await this.service.checkIdExists(objectId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.param} not found in service`
      );
    }

    return next();
  }
}