import 'reflect-metadata';
import {Container} from 'inversify';
import Application from './app/application.js';
import {applicationContainer} from './app/application.container.js';
import {Component} from './types/component.type.js';
import { movieContainer } from './modules/movie/movie.container.js';
import {userContainer} from './modules/user/user.container.js';

const mainContainer = Container.merge(
  applicationContainer,
  movieContainer,
  userContainer
);

async function bootstrap() {
  const application = mainContainer.get<Application>(Component.Application);
  await application.init();
}

bootstrap();
