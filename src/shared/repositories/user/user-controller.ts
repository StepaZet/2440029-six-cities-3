import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { DIType } from '../../libs/di/di.enum.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { UserRepository } from './user-repository.interface.js';
import { CreateUserDto, createUserDtoSchema, LoginDto, loginDtoSchema } from './dto.js';
import { SchemaValidatorMiddleware } from '../../libs/rest/schema-validator.middleware.js';
import { ObjectIdValidatorMiddleware } from '../../libs/rest/object-id-validator.middleware.js';
import { UploadFileMiddleware } from '../../libs/rest/upload-file.middleware.js';
import { Config } from '../../libs/config/config.interface.js';
import { AppSchema } from '../../libs/config/app.schema.js';
import { HttpError } from '../../libs/rest-exceptions/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { getToken } from '../../helpers/jwt.js';
import { AuthorizeMiddleware } from '../../libs/rest/authorize.middlewate.js';


@injectable()
export class UserController extends ControllerBase {
  constructor(
    @inject(DIType.Logger) logger: Logger,
    @inject(DIType.UserRepository) private userRepository: UserRepository,
    @inject(DIType.Config) private config: Config<AppSchema>,
  ) {
    super(logger);

    this.addRoute({
      path: '/register',
      httpMethod: HttpMethod.Post,
      handleAsync: this.register.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(createUserDtoSchema)
      ]
    });
    this.addRoute({
      path: '/login',
      httpMethod: HttpMethod.Post,
      handleAsync: this.login.bind(this),
      middlewares: [
        new SchemaValidatorMiddleware(loginDtoSchema)
      ]
    });
    this.addRoute({
      path: '/:id/avatar',
      httpMethod: HttpMethod.Post,
      handleAsync: this.loadAvatar.bind(this),
      middlewares: [
        new ObjectIdValidatorMiddleware(this.userRepository, 'id'),
        new AuthorizeMiddleware(this.config.get('JWT_SECRET')),
        new UploadFileMiddleware(this.config.get('STATIC_ROOT'), 'avatar')
      ]
    });
  }

  private async loadAvatar(req: Request, res: Response): Promise<void> {
    const { userId } = res.locals;
    const { id } = req.params;

    if (userId !== id) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'No access to user');
    }

    const filepath = req.file?.path;
    if (!filepath) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Avatar not loaded');
    }

    await this.userRepository.updateAvatar(userId, filepath);
    this.created(res, { filepath });
  }

  private async register(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateUserDto, req.body as object);

    const existedUser = await this.userRepository.findByEmail(dto.email);

    if (existedUser) {
      const error = `User with email ${dto.email} already exists`;
      throw new HttpError(StatusCodes.CONFLICT, error);
    }

    const avatarPath = req.file?.path;
    if (avatarPath) {
      dto.avatarUrl = avatarPath;
    }

    const user = await this.userRepository.create(dto, this.config.get('SALT'));
    this.created(res, user);
  }


  private async login(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(LoginDto, req.body as object);

    const user = await this.userRepository.checkPassword(dto.email, dto.password, this.config.get('SALT'));
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Wrong credentials');
    }

    const accessToken = await getToken({ userId: user.id }, this.config.get('JWT_SECRET'));
    this.ok(res, { accessToken });
  }
}
