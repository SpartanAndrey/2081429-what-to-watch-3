import {IsArray, IsDateString, IsEnum, IsInt, MaxLength, MinLength, IsString, IsOptional, Length} from 'class-validator';
import { Genres } from '../../../types/genre.type.js';

export default class EditMovieDto {
  @IsOptional()
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate?: Date;

  @IsOptional()
  @IsEnum(Genres, {message: 'genre type must be Comedy/Crime/Documentary/Drama/Horror/Family/Romance/Scifi/Thriller'})
  public genre?: string;

  @IsOptional()
  @IsInt({message: 'year must be an integer'})
  public year?: number;

  @IsOptional()
  @IsString({message: 'preview must be a string'})
  public preview?: string;

  @IsOptional()
  @IsString({message: 'video must be a string'})
  public video?: string;

  @IsOptional()
  @IsArray({message: 'actors must be an array'})
  public actors?: string[];

  @IsOptional()
  @IsString({message: 'director must be a string'})
  @Length(2, 50, {message: 'Min length for director is 2, max is 50'})
  public director?: string;

  @IsOptional()
  @IsInt({message: 'duration must be an integer'})
  public duration?: number;

  @IsOptional()
  @IsString({message: 'poster must be a string'})
  public poster?: string;

  @IsOptional()
  @IsString({message: 'background image must be a string'})
  public backgroundImage?: string;

  @IsOptional()
  @IsString({message: 'background color must be a string'})
  public backgroundColor?: string;
}
