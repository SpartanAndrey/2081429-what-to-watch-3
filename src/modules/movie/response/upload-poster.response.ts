import {Expose} from 'class-transformer';

export default class UploadPosterResponse {
  @Expose()
  public poster!: string;
}
