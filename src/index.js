import express from 'express';
let app = express();
import config from './config';
import logger from './utilities/logger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
const PORT = config.app.port;
import bodyParser from 'body-parser';
import cors from 'cors';
let server = require('http').Server(app);
import fileUpload from 'express-fileupload';
let logErrors = require('./middlewares/logErrors');
let clientErrorHandler = require('./middlewares/clientErrorHandler');
let Sanatize = require('./middlewares/sanatize');

import queue from './utilities/queue';
import redis from './utilities/redis';
import mongoose from 'mongoose';
/*
    Mongoose setup
*/
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.database.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', logger.error);
mongoose.Promise = global.Promise;


/*
     XSS Security
*/
app.use(cookieParser('etonBikes', {
    httpOnly: true
}));

/*
    initialising queue and mail
*/

queue.init();
redis.init();

/*
    CSRF Security error handler
*/
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err)
    } else {

        res.status(403).send({
            status: -2,
            message: 'Unauthorized'
        });
        res.end();
    }
})

app.use(fileUpload({
    debug: true,
    limits: { fileSize: config.storage.maxFileSize }
}));
app.use('/files', express.static('files'))
app.use(helmet());
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// use it before all route definitions
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization, token");
    next();
});

app.use('/api/admin', Sanatize, require('./routes/admin'));
app.use('/api/customer', Sanatize, require('./routes/user'));
app.use(logErrors)
app.use(clientErrorHandler)

server.listen(PORT, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Server started at : ' + PORT);
    }
});