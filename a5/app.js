const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config(); // This allows us to use variables in .env file through process.env
const isProduction = process.env.NODE_ENV === 'production'; // process.env will be used by heroku to provide configs and NODE_ENV will be set to production there.

const indexRouter = require('./routes/index');
const freetsRouter = require('./routes/freets');
const usersRouter = require('./routes/users');

const app = express();

// set up user session
app.use(session({
    secret: 'fritter',
    resave: true,
    saveUninitialized: true
}));

// allows us to make requests from POSTMAN
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// server html+css+js frontend
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'public'))); // in Heroku we want dist but for dev we want public so we don't have to rebuild everytime we change something.

app.use('/', indexRouter);
app.use('/api/freets', freetsRouter);
app.use('/api/users', usersRouter);
app.use('*', function (req, res) {
  res.redirect('/').end();
});
module.exports = app;
