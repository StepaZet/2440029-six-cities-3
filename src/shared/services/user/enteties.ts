import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';
import { User, UserType } from '../../models/user.js';
import { generatePassword } from '../../helpers/password.js';

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
  public type: UserType = UserType.Common;

  @prop({ required: false, default: null })
  public avatarUrl?: string;

  constructor(createSchema: User) {
    super();

    this.email = createSchema.email;
    this.avatarUrl = createSchema.avatarUrl;
    this.name = createSchema.name;
    this.type = createSchema.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = generatePassword(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
