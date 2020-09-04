const path = require('path');
const fs = require('fs');
const moment = require('moment');
import config from '../config'
const Queue = require('./queue');

const DEBUG = 100;
const INFO = 200;
const WARNING = 300;
const ERROR = 400;

const levels = {
  100: 'DEBUG',
  200: 'INFO',
  300: 'WARNING',
  400: 'ERROR',
};

class Logger {

  constructor() {
    return {
      error: this._log.bind(this, ERROR),
      debug: this._log.bind(this, DEBUG),
      warn: this._log.bind(this, WARNING),
      info: this._log.bind(this, INFO)
    }
  }

  _path() {
    const date = new Date();
    console.log("path", config.log.path)
    return path.join(config.log.path, `wittyVows-${moment(date).format('YYYY-MM-DD')}.log`);
  }

  _log(level, error, name) {
    const formatted = this._format(level, error, name);
    Queue.log({ message: formatted });
    Queue.execute('log', this._write.bind(this));
  }

  _write(data, cb) {
    return fs.writeFile(this._path(), data.message + "\r\n", {
      flag: "a"
    }, function (err, res) {
      if (!err) cb();
    });
  }

  _format(level, error, name = 'wittyVows') {
    if (error.stack) error = error.stack;
    return `${this._date()} ${name}-${levels[level]}: ${JSON.stringify(error)}`;
  }

  _date() {
    const date = new Date();
    return `[${moment(date).format('YYYY-MM-DD-HH-mm-ss')}]`;
  }
}

module.exports = new Logger();
