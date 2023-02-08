import {inject, injectable} from 'inversify';
import {MovieServiceInterface} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import EditMovieDto from './dto/edit-movie.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import { UserEntity } from '../user/user.entity.js';
import {Component} from '../../types/component.type.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {DEFAULT_MOVIE_COUNT} from './movie.constant.js';
import { SortType } from '../../types/sort.type.js';
import mongoose from 'mongoose';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.title}`);

    return result
      .populate(['userId']);
  }

  public async findById(movieId: string, userId?: string): Promise<DocumentType<MovieEntity>[] | null> {
    const userData = !userId ? null :
      await this.userModel
        .aggregate([
          {
            $match: { '_id': new mongoose.Types.ObjectId(userId) },
          },
          {
            $project: {'_id': 0, 'favorites': 1}
          },
        ]).exec();

    const favorites = !userData ? [] : userData[0].favorites;

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
          $addFields:
          {
            id: { $toString: '$_id'},
            rating: {$avg: '$commentData.rating'},
            comments: { $size: '$commentData'},
            isFavorite: {$in: ['$_id', favorites]}
          }
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
      ]);
  }

  public async find(count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'movieId',
            as: 'commentData'
          }
        },
        {
          $addFields:
        { id: { $toString: '$_id'}, comments: { $size: '$commentData'}}
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
          $limit: limit
        },
        {
          $sort: { postDate: SortType.Down }
        }
      ]);
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
      .aggregate([
        {
          $match: {'genre': genreType},
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
          $addFields:
      { id: { $toString: '$_id'}, comments: { $size: '$commentData'}}
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
          $limit: limit
        },
        {
          $sort: { postDate: SortType.Down }
        }
      ]);
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

  public async exists(movieId: string): Promise<boolean> {
    return (await this.movieModel
      .exists({_id: movieId})) !== null;
  }
}
