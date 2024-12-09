import 'reflect-metadata';
import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { DIType } from '../../libs/di/di.enum.js';
import { UserRepository } from './user-repository.interface.js';
import { Logger } from '../../libs/logging/logger.interface.js';
import { UserEntity } from './enteties.js';
import { CreateUserDto } from './dto.js';

@injectable()
export class DefaultUserRepository implements UserRepository {
  constructor(
    @inject(DIType.Logger) private readonly logger: Logger,
    @inject(DIType.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(schema: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(schema);
    user.setPassword(schema.password);

    const result = this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({ email }).exec();
  }
}
