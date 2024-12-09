import { UUID } from 'node:crypto';
import { getModelForClass, prop, defaultClasses, modelOptions } from '@typegoose/typegoose';


@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public text!: string;

  @prop({required: true})
  public rating!: number;

  @prop({required: true})
  public authorId!: UUID;

  @prop({required: true})
  public offerId!: UUID;
}

export const CommentModel = getModelForClass(CommentEntity);
