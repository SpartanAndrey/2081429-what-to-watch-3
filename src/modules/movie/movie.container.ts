import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {ControllerInterface} from '../../common/controller/controller.interface.js';
import {MovieEntity, MovieModel} from './movie.entity.js';
import {MovieServiceInterface} from './movie-service.interface.js';
import MovieController from './movie.controller.js';
import MovieService from './movie.service.js';
import {Component} from '../../types/component.type.js';

const movieContainer = new Container();

movieContainer.bind<MovieServiceInterface>(Component.MovieServiceInterface).to(MovieService);
movieContainer.bind<types.ModelType<MovieEntity>>(Component.MovieModel).toConstantValue(MovieModel);
movieContainer.bind<ControllerInterface>(Component.MovieController).to(MovieController).inSingletonScope();

export {movieContainer};
