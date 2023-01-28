import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class MovieResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public genre!: string;

  @Expose()
  public preview!: string;

  @Expose()
  public comments!: number;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public poster!: string;
}
