const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config');

mongoose.promise = global.Promise;

const isProduction = (process.env.NODE_ENV === 'production');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './../public')));
app.use(session({
    secret: "ebububebubu",
    resave: false,
    saveUninitialized: false
}));

app.set('jwtSecret', config.jwtSecret);

// DB Setting
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongodb server');
});
mongoose.connect('mongodb://localhost/blog');

// Add Model
require('./models/post');
require('./models/account');
// Add Route
app.use(require('./routes'));

// Error Handling
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if(!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err
            }
        });
    });
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {}
        }
    });
});

const port = 8000;

app.listen(port, () => {
    console.log("Server on");
});
