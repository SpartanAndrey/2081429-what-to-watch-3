import {inject, injectable} from 'inversify';
import {ConfigInterface} from '../common/config/config.interface.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {Component} from '../types/component.type.js';
import {getURI} from '../utils/db.js';
import {DatabaseInterface} from '../common/database-client/database.interface.js';
//import { MovieServiceInterface } from '../modules/movie/movie-service.interface.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    //@inject(Component.MovieServiceInterface) private movieService: MovieServiceInterface,
    @inject(Component.UserServiceInterface) private userService: UserServiceInterface
  ){}

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    //const testFunc = await this.movieService.findFavorites('63c29007cdb71a70b34f9f28');
    const testFunc2 = await this.userService.findFavorites('63c29007cdb71a70b34f9f28');
    console.log(testFunc2);
  }
}
