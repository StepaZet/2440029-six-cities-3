import { getModelForClass, prop, defaultClasses, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/enteties.js';
import { AccommodationType, CityType, ConvenienceType } from '../../models/rent-offer.js';


@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop()
  public description?: string;

  @prop({ required: true })
  public city!: CityType;

  @prop({ required: true })
  public previewUrl!: string;

  @prop({ default: [], type: () => [String] })
  public imagesUrls!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true })
  public accommodationType!: AccommodationType;

  @prop({ required: true })
  public roomCount!: number;

  @prop({ required: true })
  public guestCount!: number;

  @prop({ required: true })
  public rentPrice!: number;

  @prop({ required: true, type: () => [String] })
  public conveniences!: ConvenienceType[];

  @prop({ required: true, ref: UserEntity })
  public authorId!: Ref<UserEntity>;

  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;

  @prop({ required: true })
  public commentCount!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
