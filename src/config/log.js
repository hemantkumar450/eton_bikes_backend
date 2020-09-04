import env from '../utilities/env';

const log = {
  // path: env('LOG_PATH', '/Users/atul/webroot/testingtool/log/')
  path: process.env.LOG_PATH || '/D:/Projects/Examples/eton_bikes/backend/logs/'
}

export default log;
