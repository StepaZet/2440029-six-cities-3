import { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller } from './controller.interface.js';
import { Route } from './route.interface.js';
import { HttpMethod } from './http-method.enum.js';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { Logger } from '../logging/logger.interface.js';

@injectable()
export abstract class ControllerBase implements Controller {
  public readonly router: Router;
  readonly prefix!: string;

  constructor(
    protected logger: Logger
  ) {
    this.router = Router();
  }

  public addRoute(route: Route): void {
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.handleAsync.bind(item))
    );

    const wrappedHandler = asyncHandler(route.handleAsync.bind(route));

    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrappedHandler] : [wrappedHandler];

    for (const handler of allHandlers) {
      switch (route.httpMethod) {
        case HttpMethod.Get:
          this.router.get(route.path, async (res, req, next) => await handler(res, req, next));
          break;
        case HttpMethod.Post:
          this.router.post(route.path, async (res, req, next) => await handler(res, req, next));
          break;
        case HttpMethod.Delete:
          this.router.delete(route.path, async (res, req, next) => await handler(res, req, next));
          break;
        case HttpMethod.Put:
          this.router.put(route.path, async (res, req, next) => await handler(res, req, next));
          break;
        case HttpMethod.Patch:
          this.router.patch(route.path, async (res, req, next) => await handler(res, req, next));
          break;
      }
    }

    this.logger.info(`Added route: ${route.httpMethod} ${this.prefix}${route.path}`);
  }


  public send<T>(res: Response, statusCode: StatusCodes, data: T): void {
    res.statusCode = statusCode;
    res.send(data);
  }

  public notFound<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NOT_FOUND, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }
}
