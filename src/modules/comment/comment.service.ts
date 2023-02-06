import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentServiceInterface} from './comment-service.interface.js';
import {Component} from '../../types/component.type.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';
import { SortType } from '../../types/sort.type.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('userId');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({movieId})
      .limit(DEFAULT_COMMENT_COUNT)
      .sort({ postDate: SortType.Down })
      .populate('userId');
  }

  public async deleteByMovieId(movieId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({movieId})
      .exec();

    return result.deletedCount;
  }
}
