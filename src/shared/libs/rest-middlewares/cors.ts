import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';

export class CorsMiddleware implements Middleware {
  public async handleAsync(_req: Request, res: Response, next: NextFunction): Promise<void> {
    res.set('Access-Control-Allow-Origin', '*');
    next();
  }
}
