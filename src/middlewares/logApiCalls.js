const Logger = require('../utilities/logger');

module.exports = function logApiCalls(req) {
    const object = Object.assign({ method: req.method },
        { req: req.url },
        { body: req.body },
        { params: req.params },
        { user_id: req.user.id },
        { query: req.query })
    Logger.info(object);
}