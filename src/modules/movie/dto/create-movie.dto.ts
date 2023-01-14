export default class CreateMovieDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public genre!: string;
  public year!: number;
  public rating!: number;
  public preview!: string;
  public video!: string;
  public actors!: string[];
  public director!: string;
  public duration!: number;
  public comments!: number;
  public userId!: string;
  public poster!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
}
