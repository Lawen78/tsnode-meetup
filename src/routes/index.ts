import {Application} from 'express';
import * as auth from './auth';

export function initRoutes(app: Application){
  auth.AuthRoutes(app);
}