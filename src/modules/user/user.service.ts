import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import { MovieEntity } from '../movie/movie.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.type.js';
import LoginUserDto from './dto/login-user.dto.js';
import { FavoriteStatus } from './user.constant.js';
import {DEFAULT_AVATAR_FILE_NAME} from './user.constant.js';
import mongoose from 'mongoose';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
        @inject(Component.LoggerInterface) private logger: LoggerInterface,
        @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
        @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findFavorites(userId: string): Promise<DocumentType<UserEntity>[] | null> {
    return this.userModel
      .aggregate([
        {
          $unwind: '$favorites'
        },
        {
          $match: { '_id': new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'movies',
            localField: 'favorites',
            foreignField: '_id',
            as: 'movie'
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: 'favorites',
            foreignField: 'movieId',
            as: 'commentData'
          }
        },
        {
          $unwind: '$movie'
        },
        {
          $addFields: {
            id: { $toString: '$movie._id'},
            title: '$movie.title',
            postDate: '$movie.postDate',
            genre: '$movie.genre',
            preview: '$movie.previews',
            user: '$movie.userId',
            poster: '$movie.poster',
            comments: { $size: '$commentData'}
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user'
        },
      ]);
  }

  public async changeFavoriteStatus(userId: string, movieId: string, status: number): Promise<void | null> {

    if (status === FavoriteStatus.Positive) {
      await this.movieModel.findByIdAndUpdate(movieId,
        {
          $set: {isFavorite: Boolean(FavoriteStatus.Positive)},
        },
        { new: true }
      );

      return this.userModel.findByIdAndUpdate(userId,
        {
          $push: {favorites: new mongoose.Types.ObjectId(movieId)}
        });
    }

    await this.movieModel.findByIdAndUpdate(movieId,
      {
        $set: {isFavorite: Boolean(FavoriteStatus.Negative)},
      },
      { new: true }
    );

    return this.userModel.findByIdAndUpdate(userId,
      {
        $pull: {favorites: new mongoose.Types.ObjectId(movieId)}
      });
  }

  public async exists(userId: string): Promise<boolean> {
    return (await this.userModel
      .exists({_id: userId})) !== null;
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (! user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }
}
