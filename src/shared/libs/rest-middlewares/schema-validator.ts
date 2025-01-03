import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { ObjectSchema } from 'joi';
import { HttpError } from '../rest-exceptions/http-error.js';
import { HttpMethod } from '../rest/http-method.enum.js';

export class SchemaValidatorMiddleware implements Middleware {
  constructor(private schema: ObjectSchema) {}

  public async handleAsync(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      req.body = await this.schema.validateAsync(req.body, {
        context: { isEditForm: req.method === HttpMethod.Post }
      });

      return next();
    } catch (error: unknown) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        String(error),
      );
    }
  }
}
