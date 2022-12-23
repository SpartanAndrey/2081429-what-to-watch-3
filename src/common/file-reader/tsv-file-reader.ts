import { readFileSync } from 'fs';
import { Movie } from '../../types/movie.types.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Movie[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, genre, year, rating, preview, video, actors, director, duration, comments, name, email, avatar, password, poster, backgroundImage, backgroundColor]) => ({
        title,
        description,
        postDate: new Date(postDate),
        genre: genre.split(';').map((item) => (item)),
        year: Number(year),
        rating: Number(rating),
        preview,
        video,
        actors: actors.split(';').map((actor) => (actor)),
        director,
        duration: Number(duration),
        comments: Number(comments),
        user: {name, email, avatar, password},
        poster,
        backgroundImage,
        backgroundColor,
      }));
  }
}
