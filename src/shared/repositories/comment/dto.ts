import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/enteties.js';
import { OfferEntity } from '../offer/enteties.js';

export class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public authorId!: Ref<UserEntity>;
  public offerId!: Ref<OfferEntity>;
}
