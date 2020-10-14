const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// import all the express routes we will be using
const indexRouter = require('./routes/index');
const frittersRouter = require('./routes/fritters');
const usersRouter = require('./routes/users');

const app = express();

//
app.use(session({
    secret: "fritter",
    resave: true,
    saveUninitialized: true
}));

app.use(cors());    //

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/freets', frittersRouter);
app.use('/api/users', usersRouter);

app.all('*', (req, res) => {
    res.status(404).send(["Unknown/unsupported URL. Please <a href=\"/\">click here</a> to return to the main page.", "", "",
                                    "For developers:",
                                    "Only the following endpoints are supported:",
                                        ["\tGET /",
                                        "POST /signin",
                                        "POST /signout",
                                        "GET/POST /api/freets/",
                                        "GET /api/freets/author/:username",
                                        "PUT/DELETE /api/freets/:id",
                                        "POST/PUT/DELETE /api/users",
                                        ""].join('<br>\t'),
                                    ""].join('<br>')).end();
});

module.exports = Object.freeze(app);
