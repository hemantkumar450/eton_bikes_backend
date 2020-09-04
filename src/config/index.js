import env from '../utilities/env';
import app from './app';
import storage from './storage';
import database from './database';
import redis from './redis';
import log from './log';

const config = {
  app,
  storage,
  database,
  redis,
  log,
};
export default config;
