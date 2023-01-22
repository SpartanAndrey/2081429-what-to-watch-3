import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByMovieId(movieId: string): Promise<number | null>;
}
