import { Route } from './route.interface.js';
import { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface Controller {
  readonly router: Router;
  readonly prefix: string;

  addRoute(route: Route): void;
  send<T>(res: Response, statusCode: StatusCodes, data: T): void;
  ok<T>(res: Response, data: T): void;
  created<T>(res: Response, data: T): void;
}
