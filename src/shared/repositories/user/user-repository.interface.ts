import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UserEntity } from './enteties.js';
import { CreateUserDto } from './dto.js';
import { CheckIdService } from '../../libs/rest/check-id-service.interface.js';

export interface UserRepository extends CheckIdService {
  create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
}
