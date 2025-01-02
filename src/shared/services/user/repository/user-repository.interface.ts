import { DocumentType } from '@typegoose/typegoose';
import { ObjectId, Types } from 'mongoose';
import { UserEntity } from '../enteties.js';
import { CreateUserDto } from '../dto.js';
import { CheckIdRepository } from '../../../libs/rest/check-id-repository.interface.js';

export interface UserRepository extends CheckIdRepository {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  checkPassword(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null>;
  updateAvatar(id: ObjectId, avatarPath: string): Promise<void>;
}
