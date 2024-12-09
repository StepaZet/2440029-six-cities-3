import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { createHash } from 'node:crypto';
import { User, UserType } from '../../models/user.js';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public password?: string;

  @prop({ required: true })
  public type: UserType = UserType.common;

  @prop({ required: false, default: null })
  public avatarUrl?: string;

  constructor(createSchema: User) {
    super();

    this.email = createSchema.email;
    this.avatarUrl = createSchema.avatarUrl;
    this.name = createSchema.name;
    this.type = createSchema.type;
  }

  public setPassword(password: string) {
    this.password = createHash('sha256').update(password).digest('hex');
  }
}

export const UserModel = getModelForClass(UserEntity);
