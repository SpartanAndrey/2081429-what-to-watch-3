import { User } from './user.type';

export type Movie = {
    title: string;
    description: string;
    postDate: Date;
    genre: string;
    year: number;
    rating: number;
    preview: string;
    video: string;
    actors: string[];
    director: string;
    duration: number;
    comments: number;
    user: User;
    poster: string;
    backgroundImage: string;
    backgroundColor: string;
}
