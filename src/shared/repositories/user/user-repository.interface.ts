import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../../models/user.js';
import { UserEntity } from './enteties.js';

export interface UserRepository {
  create(dto: User): Promise<DocumentType<UserEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
}
