import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { Logger } from '../logging/logger.interface.js';

export class LoggingMiddleware implements Middleware {
  constructor (
    private readonly logger: Logger,
  ) {}

  public async handleAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.info(`Handled request: ${req.method} ${req.url} ${res.statusCode}`);
    next();
  }
}
