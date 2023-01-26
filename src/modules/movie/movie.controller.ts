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
//import { StatusCodes } from 'http-status-codes';

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
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.getMovie});
    this.addRoute({path: '/:movieId', method: HttpMethod.Post, handler: this.updateMovie});
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.deleteMovie});
    this.addRoute({path: '/genres/:genre', method: HttpMethod.Get, handler: this.getByGenre});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.movieService.find();
    const movieResponse = fillDTO(MovieResponse, result);
    this.ok(
      res, movieResponse
    );
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const result = await this.movieService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(MovieResponse, result)
    );
  }

  public async getMovie({params}: Request, res: Response): Promise<void> {
    const result = await this.movieService.findById(params.movieId);
    this.ok(
      res,
      fillDTO(MovieResponse, result)
    );
  }

  public async updateMovie({body, params}: Request, res: Response): Promise<void> {
    const result = await this.movieService.editById(params.movieId, body);
    this.created(
      res,
      fillDTO(MovieResponse, result)
    );
  }

  public async deleteMovie({params}: Request, res: Response): Promise<void> {
    await this.movieService.deleteById(params.movieId);
    this.noContent(
      res
    );
  }

  public async getByGenre({params}: Request, res: Response): Promise<void> {
    const result = await this.movieService.findByGenre(params.genre);
    this.ok(
      res,
      fillDTO(MovieResponse, result)
    );
  }

  public async getPromo(_req: Request, res: Response): Promise<void> { //WIP
    const result = await this.movieService.findPromo();
    this.ok(
      res, fillDTO(MovieResponse, result)
    );
  }
}
