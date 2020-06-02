import { join } from 'path';
import express from 'express';
import { urlencoded, json } from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import { connection, connect } from 'mongoose';
import morgan from 'morgan';
import config from './config';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static(join(__dirname, './../public')));
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

app.set('jwtSecret', config.jwtSecret);

// DB Setting
const db = connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongodb server');
});
connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Add Model
import './models/post';
import './models/account';
import './models/category';
// Add Route
app.use(require('./routes').default);

// Error Handling
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {}
        }
    });
});

app.listen(config.port, () => {
    console.log("Server on port:" + config.port);
});
