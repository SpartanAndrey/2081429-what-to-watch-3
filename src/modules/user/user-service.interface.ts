import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<UserEntity>[] | null>;
  addFavorite(userId: string, movieId: string): Promise<void | null>;
  removeFavorite(userId: string, movieId: string): Promise<void | null>;
}
