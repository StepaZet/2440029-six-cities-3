import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/enteties.js';
import { OfferEntity } from '../offer/enteties.js';
import Joi from 'joi';
import { Types } from 'mongoose';

export class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public authorId!: Ref<UserEntity>;
  public offerId!: Ref<OfferEntity>;
}


export const createCommentDtoSchema = Joi.object({
  text: Joi.string().required().min(5).max(1024),
  rating: Joi.number().required().min(1).max(5),
  authorId: Joi.string().custom((value, helpers) => {
    const filtered = Types.ObjectId.isValid(value);
    return !filtered ? helpers.error('any.invalid') : value;
  }, 'invalid objectId'),
  offerId: Joi.string().required().custom((value, helpers) => {
    const filtered = Types.ObjectId.isValid(value);
    return !filtered ? helpers.error('any.invalid') : value;
  }, 'invalid objectId')
});
