import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.type.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import MovieResponse from './response/movie.response.js';
import { fillDTO } from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { StatusCodes } from 'http-status-codes';
import MovieCardResponse from './response/movie-card.response.js';
import HttpError from '../../common/errors/http-error.js';
import { RequestQuery } from '../../types/request-query.type.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.getMovie});
    this.addRoute({path: '/:movieId', method: HttpMethod.Post, handler: this.updateMovie});
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.deleteMovie});
  }

  public async index({query}: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {

    const limit = query.limit ? parseInt(query.limit, 10) : undefined;
    const selectedGenre = query.genre;

    if (!selectedGenre) {
      const result = await this.movieService.find(limit);
      this.ok(
        res, fillDTO(MovieResponse, result)
      );
    } else {
      const result = await this.movieService.findByGenre(selectedGenre, limit);
      this.ok(
        res, fillDTO(MovieResponse, result)
      );
    }
  }

  public async getPromo(_req: Request, res: Response): Promise<void> { //WIP
    const result = await this.movieService.findPromo();
    this.ok(
      res, fillDTO(MovieCardResponse, result)
    );
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const result = await this.movieService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async getMovie({params}: Request, res: Response): Promise<void> {
    const result = await this.movieService.findById(params.movieId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Movie does not exist.',
        'MovieController'
      );
    }

    this.ok(
      res,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async updateMovie({body, params}: Request, res: Response): Promise<void> {

    const existsMovie = await this.movieService.findById(params.movieId);

    if (!existsMovie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Movie does not exist.',
        'MovieController'
      );
    }

    const result = await this.movieService.editById(params.movieId, body);
    this.created(
      res,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async deleteMovie({params}: Request, res: Response): Promise<void> {

    const existsMovie = await this.movieService.findById(params.movieId);

    if (!existsMovie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Movie does not exist.',
        'MovieController'
      );
    }

    await this.movieService.deleteById(params.movieId);
    this.noContent(
      res
    );
  }
}
