import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { DIType } from '../../libs/di/di.enum.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { UserRepository } from './user-repository.interface.js';
import { CreateUserDto, createUserDtoSchema } from './dto.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { UploadFileMiddleware } from '../../libs/rest/upload-file.middleware.js';
import { Config } from '../../libs/config/config.interface.js';
import { AppSchema } from '../../libs/config/app.schema.js';


@injectable()
export class UserController extends ControllerBase {
  constructor(
    @inject(DIType.Logger) logger: Logger,
    @inject(DIType.UserRepository) private userRepository: UserRepository,
    @inject(DIType.Config) private config: Config<AppSchema>,
  ) {
    super(logger);

    this.addRoute({path: '/', httpMethod: HttpMethod.Post, handleAsync: this.create.bind(this), middlewares: [new SchemaValidatorMiddleware(createUserDtoSchema)]});
    this.addRoute({path: '/:id/avatar', httpMethod: HttpMethod.Post, handleAsync: this.loadAvatar.bind(this), middlewares: [new ObjectIdValidatorMiddleware(this.userRepository, 'id'), new UploadFileMiddleware(this.config.get('STATIC_ROOT'), 'avatar')]});
  }

  private async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateUserDto, req.body as object);
    const user = await this.userRepository.create(dto);
    this.created(res, user);
  }

  private async loadAvatar(req: Request, res: Response): Promise<void> {
    this.created(res, { filepath: req.file?.path });
  }
}
