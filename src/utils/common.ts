import crypto from 'crypto';
import { Movie } from '../types/movie.type.js';
import {plainToInstance} from 'class-transformer';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';

export const createMovie = (row: string) => {
  const items = row.replace('\n', '').split('\t');

  const [title, description, postDate, genre, year, rating, preview, video, actors, director, duration, comments, name, email, avatar, password, poster, backgroundImage, backgroundColor] = items;

  return {
    title,
    description,
    postDate: new Date(postDate),
    genre,
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
  } as Movie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message,
});
