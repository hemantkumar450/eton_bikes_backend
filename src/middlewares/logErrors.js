const Logger = require('../utilities/logger');

module.exports = function logErrors(err, req, res, next) {
  // TO DO:- handle for err object
  Logger.error(err)
  console.log(err);
  next(err)
}