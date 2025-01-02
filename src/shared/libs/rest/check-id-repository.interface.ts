import { Types } from 'mongoose';

export interface CheckIdRepository {
  doesIdExist(id: Types.ObjectId): Promise<boolean>;
}
