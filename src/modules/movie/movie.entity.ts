import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})

export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop()
  public postDate!: Date;

  @prop({required: true})
  public genre!: string;

  @prop({required: true})
  public year!: number;

  @prop({default: 0})
  public rating!: number;

  @prop({required: true})
  public preview!: string;

  @prop({required: true})
  public video!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true})
  public director!: string;

  @prop({required: true})
  public duration!: number;

  @prop({default: 0})
  public comments!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true})
  public poster!: string;

  @prop({required: true})
  public backgroundImage!: string;

  @prop({required: true})
  public backgroundColor!: string;

}

export const MovieModel = getModelForClass(MovieEntity);
