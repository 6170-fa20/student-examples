const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const freetsRouter = require('./routes/freets');
const refreetsRouter = require('./routes/refreets');
const usersRouter = require('./routes/users');

// initialize app
const app = express();

// set up user session
app.use(session({
    secret: 'a2-users',
    resave: true,
    saveUninitialized: true
}));

app.use(logger('dev'));

// accept json
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// use cookies for sessions
app.use(cookieParser());

// server html+js+frontend
app.use(express.static(path.join(__dirname, 'public')));

// logging of requests
app.use((req, res, next) => {
    console.log('Processing ' + req.method + ' ' + req.url + ' session: ' + req.session.id);
    if (req.session.username !== undefined) {
        console.log(`user ${req.session.username} is signed in`);
        next();
    } else {
        console.log(`user is not signed in`);
        next();
    }
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/freets', freetsRouter);
app.use('/api/refreets', refreetsRouter);

// handle unknown endpoints
app.use('*', (req, res, next) => {
    res.status(404).json({error: `endpoint not found`}).end();
    next();
});


module.exports = app;
