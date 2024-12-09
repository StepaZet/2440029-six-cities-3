import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http-error.js';
import { DIType } from '../di/di.enum.js';
import { Logger } from '../logging/logger.interface.js';
import { ExceptionFilter } from './exception-filter.interface.js';


@injectable()
export class LoggingExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(DIType.Logger) private logger: Logger
  ) {}

  handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof HttpError) {
      res.statusCode = err.httpStatusCode;
      res.send({error: err.message, detail: err.detail});
    }

    this.logger.error(err.message, err);
    res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    res.send({error: err.message});
  }
}
