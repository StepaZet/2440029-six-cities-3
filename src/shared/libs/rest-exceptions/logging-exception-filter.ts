import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http-error.js';
import { DIName } from '../di/di.enum.js';
import { Logger } from '../logging/logger.interface.js';
import { ExceptionFilter } from './exception-filter.interface.js';


@injectable()
export class LoggingExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(DIName.Logger) private logger: Logger
  ) {}

  handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof HttpError) {
      res.statusCode = err.httpStatusCode;
      res.send({error: err.message, detail: err.detail});
      return;
    }

    this.logger.error(err.message, err);
    res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    res.send({error: err.message});
  }
}
