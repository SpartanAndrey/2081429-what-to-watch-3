import {inject, injectable} from 'inversify';
import {MovieServiceInterface} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import EditMovieDto from './dto/edit-movie.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {Component} from '../../types/component.type.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {DEFAULT_MOVIE_COUNT, FILM_SHORT_FIELDS} from './movie.constant.js';
import { SortType } from '../../types/sort.type.js';
import mongoose from 'mongoose';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.title}`);

    return result;
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity>[] | null> {
    return this.movieModel
      .aggregate([
        {
          $match: {'_id': new mongoose.Types.ObjectId(movieId)},
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'movieId',
            as: 'commentData'
          }
        },
        {
          $set:
          { rating: {$avg: '$commentData.rating'}, comments: { $size: '$commentData'}}
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $unset: 'user._id'
        },
      ]);
  }

  public async find(count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel
      .find({}, {}, {limit})
      .select(FILM_SHORT_FIELDS)
      .sort({postDate: SortType.Down})
      .populate(['userId'])
      .exec();
  }

  public async editById(movieId: string, dto: EditMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndDelete(movieId)
      .exec();
  }

  public async findByGenre(genreType: string, count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel
      .find({genre: genreType}, {}, {limit})
      .sort({postDate: SortType.Down})
      .populate(['userId'])
      .exec();
  }

  public async findPromo(): Promise<DocumentType<MovieEntity>[] | null> {

    return this.movieModel
      .aggregate([
        {
          $sample: {size: 1},
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $unset: 'user._id'
        },
      ]);
  }

  public async incCommentCount(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async exists(movieId: string): Promise<boolean> {
    return (await this.movieModel
      .exists({_id: movieId})) !== null;
  }

}
