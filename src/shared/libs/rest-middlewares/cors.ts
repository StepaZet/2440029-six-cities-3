import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';

export class CorsMiddleware implements Middleware {
  public async handleAsync(_req: Request, res: Response, next: NextFunction): Promise<void> {
    res.set('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  }
}
