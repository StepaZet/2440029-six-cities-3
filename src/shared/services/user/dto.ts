import Joi from 'joi';
import { UserType } from '../../models/user.js';

export class CreateUserDto {
  constructor(
  public email: string,
  public name: string,
  public password: string,
  public type: UserType,
  public avatarUrl?: string,
  ) {}
}

export class LoginDto {
  constructor(
  public email: string,
  public password: string,
  ) {}
}

export const loginDtoSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(12)
});

export const createUserDtoSchema = Joi.object({
  email: Joi.string().required().email(),
  avatarUrl: Joi.string().uri(),
  name: Joi.string().required().min(1).max(15),
  password: Joi.string().required().min(6).max(12),
  type: Joi.string().required().valid(...Object.values(UserType))
});
