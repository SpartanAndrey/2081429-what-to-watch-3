import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { MovieGeneratorInterface } from './movie-generator.interface';

const MIN_YEAR = 2010;
const MAX_YEAR = 2022;
const MIN_RATING = 0;
const MAX_RATING = 10;
const RATING_AFTER_DIGIT = 1;
const MIN_DURATION = 100;
const MAX_DURATION = 220;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 50;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItems<string>(this.mockData.genres).join(';');
    const year = generateRandomValue(MIN_YEAR, MAX_YEAR).toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, RATING_AFTER_DIGIT).toString();
    const preview = getRandomItem<string>(this.mockData.previews);
    const video = getRandomItem<string>(this.mockData.videos);
    const actors = getRandomItems<string>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.directors);
    const duration = generateRandomValue(MIN_DURATION, MAX_DURATION).toString();
    const comments = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS).toString();
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const poster = getRandomItem<string>(this.mockData.posters);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

    return [
      title, description, postDate, genre, year, rating,
      preview, video, actors, director, duration,
      comments, name, email, avatar, password, poster,
      backgroundImage, backgroundColor,
    ].join('\t');
  }
}
