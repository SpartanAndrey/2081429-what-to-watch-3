import * as core from 'express-serve-static-core';
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.type.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import {CommentServiceInterface} from '../comment/comment-service.interface';
import MovieResponse from './response/movie.response.js';
import CommentResponse from '../comment/response/comment.response.js';
import { fillDTO } from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import EditMovieDto from './dto/edit-movie.dto.js';
import MovieCardResponse from './response/movie-card.response.js';
import { RequestQuery } from '../../types/request-query.type.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';

type ParamsGetMovie = {
  movieId: string;
}

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateMovieDto)]
    });
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId')
      ]
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(EditMovieDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId')
      ]
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId')
      ]
    });
    this.addRoute({
      path: '/:movieId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId')
      ]
    });
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

  public async getPromo(_req: Request, res: Response): Promise<void> {
    const result = await this.movieService.findPromo();
    this.ok(
      res, fillDTO(MovieCardResponse, result)
    );
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const result = await this.movieService.create(body);
    this.created(
      res,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async show({params}: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {
    const result = await this.movieService.findById(params.movieId);

    this.ok(
      res,
      fillDTO(MovieCardResponse, result) //WIP incorrect id
    );
  }

  public async update({body, params}:Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, EditMovieDto>, res: Response): Promise<void> {

    const result = await this.movieService.editById(params.movieId, body);
    this.created(
      res,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async delete({params}: Request, res: Response): Promise<void> {

    await this.movieService.deleteById(params.movieId);
    this.noContent(
      res
    );
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie, object, object>, res: Response): Promise<void> {

    const comments = await this.commentService.findByMovieId(params.movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
