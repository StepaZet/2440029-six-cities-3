import { HttpMethod } from './http-method.enum.js';
import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';

export interface Route {
  path: string;
  httpMethod: HttpMethod;
  middlewares?: Middleware[];
  handleAsync(req: Request, res: Response, next: NextFunction): Promise<void>;
}
