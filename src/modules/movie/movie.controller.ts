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
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.middleware.js';
import UploadImageResponse from './response/upload-image.response.js';
import UploadPosterResponse from './response/upload-poster.response.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';

type ParamsGetMovie = {
  movieId: string;
}

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for MovieController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateMovieDto)
      ]
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
        new PrivateRouteMiddleware(),
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
        new PrivateRouteMiddleware(),
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
    this.addRoute({
      path: '/:movieId/poster',
      method: HttpMethod.Post,
      handler: this.uploadPoster,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('movieId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'poster'),
      ]
    });
    this.addRoute({
      path: '/:movieId/backgroundImage',
      method: HttpMethod.Post,
      handler: this.uploadBackgroundImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('movieId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'backgroundImage'),
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

  public async create(req: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const {body, user} = req;
    const result = await this.movieService.create({...body, userId: user.id});
    this.created(
      res,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async show({params, user}: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response): Promise<void> {

    const result = await this.movieService.findById(params.movieId, user?.id);

    this.ok(
      res,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async update(req: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, EditMovieDto>, res: Response): Promise<void> {

    const {body, params, user} = req;

    const movie = await this.movieService.findById(params.movieId);
    const currentMovie = movie ? movie[0] : null;
    const currentUser = currentMovie?.userId;

    if (user.id !== currentUser?.toString()) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You are\'t author of this movie.',
        'MovieController'
      );
    }

    const result = await this.movieService.editById(params.movieId, body);
    this.created(
      res,
      fillDTO(MovieCardResponse, result)
    );
  }

  public async delete(req: Request, res: Response): Promise<void> {

    const {params, user} = req;

    const movie = await this.movieService.findById(params.movieId);
    const currentMovie = movie ? movie[0] : null;
    const currentUser = currentMovie?.userId;

    if (user.id !== currentUser?.toString()) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You are\'t author of this movie.',
        'MovieController'
      );
    }

    await this.commentService.deleteByMovieId(params.filmId);

    const result = await this.movieService.deleteById(params.movieId);
    this.noContent(
      res,
      result
    );
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie, object, object>, res: Response): Promise<void> {

    const comments = await this.commentService.findByMovieId(params.movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async uploadBackgroundImage(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response) {
    const {movieId} = req.params;
    const updateDto = { backgroundImage: req.file?.filename };
    await this.movieService.editById(movieId, updateDto);
    this.created(res, fillDTO(UploadImageResponse, {updateDto}));
  }

  public async uploadPoster(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response) {
    const {movieId} = req.params;
    const updateDto = { poster: req.file?.filename };
    await this.movieService.editById(movieId, updateDto);
    this.created(res, fillDTO(UploadPosterResponse, {updateDto}));
  }
}
