import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../libs/rest/controller-base.js';
import { HttpMethod } from '../../libs/rest/http-method.enum.js';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { DIType } from '../../libs/di/di.enum.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { UserRepository } from './user-repository.interface.js';
import { CreateUserDto } from './dto.js';


@injectable()
export class UserController extends ControllerBase {
  constructor(
    @inject(DIType.Logger) logger: Logger,
    @inject(DIType.UserRepository) private userRepository: UserRepository
  ) {
    super(logger);

    this.addRoute({path: '/', httpMethod: HttpMethod.Post, handleAsync: this.createUserAsync});
  }

  private async createUserAsync(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateUserDto, req.body as object);
    const user = await this.userRepository.create(dto);
    this.created(res, user);
  }
}
