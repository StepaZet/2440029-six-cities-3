import Joi from 'joi';
import { Types } from 'mongoose';
import { AccommodationType, CityType, ConvenienceType } from '../../models/rent-offer.js';

export class OfferDto {
  public name!: string;
  public description!: string;
  public city!: CityType;
  public previewUrl!: string;
  public imagesUrls!: string[];
  public createdAt!: Date;
  public rating!: number;
  public commentCount!: number;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public accommodationType!: AccommodationType;
  public roomCount!: number;
  public guestCount!: number;
  public rentPrice!: number;
  public conveniences!: ConvenienceType[];
  public authorId!: Types.ObjectId;
  public latitude!: number;
  public longitude!: number;
}


export const createOfferDtoSchema = Joi.object({
  name: Joi.string().min(10).max(100).required(),
  description: Joi.string().min(20).max(1024).required(),
  createdAt: Joi.date().required(),
  city: Joi.string().valid(...Object.values(CityType)).required(),
  previewUrl: Joi.string().uri().required(),
  imagesUrls: Joi.array().items(Joi.string().uri()).required(),
  isPremium: Joi.boolean().required(),
  isFavorite:Joi.boolean().required(),
  rating: Joi.number().min(1).max(5).required(),
  accommodationType: Joi.string().valid(...Object.values(AccommodationType)).required(),
  roomCount: Joi.number().min(1).max(8).required(),
  guestCount: Joi.number().min(1).max(10).required(),
  rentPrice: Joi.number().min(100).max(100000).required(),
  conveniences: Joi.array().items(Joi.string().valid(...Object.values(ConvenienceType))).required(),
  authorId: Joi.string().required().custom((value, helpers) => {
    const filtered = Types.ObjectId.isValid(value);
    return !filtered ? helpers.error('any.invalid') : value;
  }, 'invalid objectId'),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});
