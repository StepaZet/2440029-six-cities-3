import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UserEntity } from './enteties.js';
import { CreateUserDto } from './dto.js';

export interface UserRepository {
  create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
}
