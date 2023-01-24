import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import EditMovieDto from './dto/edit-movie.dto.js';
export interface MovieServiceInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  editById(movieId: string, dto: EditMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(count?: number): Promise<DocumentType<MovieEntity>[]>;
  findByGenre(genreType: string, count?: number): Promise<DocumentType<MovieEntity>[]>;
  findById(movieId: string): Promise<DocumentType<MovieEntity>[] | null>;
  findPromo(): Promise<DocumentType<MovieEntity>[] | null>;
  incCommentCount(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  exists(movieId: string): Promise<boolean>;
}
