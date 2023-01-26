import {Expose} from 'class-transformer';

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
  public poster!: string;

  @Expose()
  public comments!: number;

  @Expose()
  public userId!: string;
}
