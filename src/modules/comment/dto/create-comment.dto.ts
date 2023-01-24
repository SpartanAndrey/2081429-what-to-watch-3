export default class CreateCommentDto {
  public rating!: number;
  public text!: string;
  public movieId!: string;
  public userId!: string;
  public favorites!: string[];
}
