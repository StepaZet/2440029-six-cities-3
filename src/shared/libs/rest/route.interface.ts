import { HttpMethod } from './http-method.enum.js';
import { NextFunction, Request, Response } from 'express';

export interface Route {
  path: string;
  httpMethod: HttpMethod;
  handleAsync(req: Request, res: Response, next: NextFunction): Promise<void>;
}
