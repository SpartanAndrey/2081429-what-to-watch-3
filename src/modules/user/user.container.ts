import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {UserEntity, UserModel} from './user.entity.js';
import {UserServiceInterface} from './user-service.interface.js';
import {ControllerInterface} from '../../common/controller/controller.interface.js';
import UserController from './user.controller.js';
import UserService from './user.service.js';
import {Component} from '../../types/component.type.js';

const userContainer = new Container();

userContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
userContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();

export {userContainer};
