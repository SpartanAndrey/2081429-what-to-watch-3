import {IsMongoId, IsString, IsInt, Length, Min, Max} from 'class-validator';
export default class CreateCommentDto {

  @IsInt({message: 'rating must be an integer'})
  @Min(1, {message: 'Minimum rating is 1'})
  @Max(10, {message: 'Maximum rating is 10'})
  public rating!: number;

  @IsString({message: 'text is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public text!: string;

  @IsMongoId({message: 'movieId field must be a valid id'})
  public movieId!: string;

  public userId!: string;
}
