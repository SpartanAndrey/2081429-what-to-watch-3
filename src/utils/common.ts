import { Movie } from '../types/movie.type.js';

export const createMovie = (row: string) => {
  const items = row.replace('\n', '').split('\t');

  const [title, description, postDate, genre, year, rating, preview, video, actors, director, duration, comments, name, email, avatar, password, poster, backgroundImage, backgroundColor] = items;

  return {
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
  } as Movie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';
