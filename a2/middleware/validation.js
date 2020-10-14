const Users = require('../models/Users');
const Fritters = require('../models/Fritters');

let userIdExists = (req, res, next) => {
    const user = Users.findOneByID(req.session.userID);
    if (user === undefined) {
        res.status(404).json({message: "User account not found (was it already deleted?)"}).end();
        return;
    }
    next();
};

let usernameExists = (req, res, next) => {
    const user = Users.findOneByUsername(req.params.username || req.body.username);
    if (user === undefined) {
        res.status(404).json({message: "Username not found"}).end();
        return;
    }
    next();
};

let usernameNotTaken = (req, res, next) => {
    const user = Users.findOneByUsername(req.params.username || req.body.username);
    if (user !== undefined) {
        res.status(409).json({message: "Username already in use"}).end();
        return;
    }
    next();
};

let usernameValid = (req, res, next) => {
    const username = req.params.username || req.body.username;
    // for now, shouldn't be empty. can be expanded to have specific length and stuff later
    // its OK to get undefined inputs as long as usernameDefined is also inserted as middleware
    if (username !== undefined && username.length === 0) {
        res.status(400).json({message: "Must specify a username"}).end();
        return;
    }
    next();
};

let passwordValid = (req, res, next) => {
    // could be expanded to check for password safety (e.g. repeated characters, too simple, etc)
    const password = req.body.password;
    // for now, shouldn't be empty. can be expanded to have specific length and stuff later
    // its OK to get undefined inputs as long as passwordDefined is also inserted as middleware
    if (password !== undefined && password.length === 0) {
        res.status(400).json({message: "Must specify a password"}).end();
        return;
    }
    next();
};

let passwordDefined = (req, res, next) => {
    const password = req.body.password;
    if (password === undefined) {
        res.status(400).json({message: "Must specify a password"}).end();
        return;
    }
    next();
};

let usernameDefined = (req, res, next) => {
    const username = req.params.username || req.body.username;
    if (username === undefined) {
        res.status(400).json({message: "Must specify a username"}).end();
        return;
    }
    next();
};

let usernameOrPasswordDefined = (req, res, next) => {
    const username = req.params.username || req.body.username;
    const password = req.body.password;

    if (username === undefined && password === undefined) {
        res.status(400).json({message: "Must specify a username and/or password"}).end();
        return;
    }
    next();
};

let passwordCorrect = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const account = Users.findOneByUsername(username);
    if (password !== account.password) {
        // we keep it intentionally vague for security reasons
        res.status(401).json({message: "Incorrect username/password combination"}).end();
        return;
    }

    next();
};

let freetExists = (req, res, next) => {
    const freet = Fritters.findOne(req.params.id || req.body.id);
    if (freet === undefined) {
        res.status(404).json({message: "Freet not found"}).end();
        return;
    }
    next();
};


let freetContentDefined = (req, res, next) => {
    const freetContent= req.body.content;
    //also do for internals of freet
    if (freetContent === undefined) {
        res.status(400).json({message: "Must specify freet content"}).end();
        return;
    }
    next();
};
let freetContentValid = (req, res, next) => {
    const freetContent= req.body.content;
    if ((!(typeof freetContent === 'string') && !(freetContent instanceof String)) || freetContent.length === 0) {
        res.status(400).json({message: "Freet content is invalid"}).end();
        return;
    }
    next();
};
let freetIdDefined = (req, res, next) => {
    const freetID= req.params.id || req.body.id;
    //also do for internals of freet
    if (freetID === undefined) {
        res.status(400).json({message: "Must specify a freetID"}).end();
        return;
    }
    next();
};

let freetIdValid = (req, res, next) => {
    const freetID= req.params.id || req.body.freetID;
    if (isNaN(freetID)) {
        res.status(400).json({message: "freet ID is invalid"}).end();
        return;
    }
    next();
};

// assuming that the freet already exists (e.g. this should come after the freetExists middleware)
let freetBelongsToUser = (req, res, next) => {
    const freet = Fritters.findOne(req.params.id || req.body.id);
    const author = freet.authorID;
    if (req.session.userID !== author) {
        res.status(403).json({message: "Unauthorized to edit this freet."}).end();
        return;
    }
    next();
};
// Instead of "usernameDefined", "passwordDefined", "freetIdDefined", ...
// We also considered a solution like this to decrease code redundancy:
// let allDefined = (fields) => {
//     return (req, res, next) => {
//         if (!fields.every(req.body.hasOwnProperty)) {
//             res.status(400).json({message: "Missing at least 1 field in body"}).end();
//             return;
//         }
//         next();
//     };
// };
// However we opted against using this so that we can give custom rejection messages for particular missing fields

module.exports = Object.freeze({userIdExists, usernameExists, usernameNotTaken, usernameValid, passwordValid, passwordDefined, usernameDefined, usernameOrPasswordDefined, passwordCorrect,
                                freetExists, freetContentDefined, freetContentValid, freetIdDefined, freetIdValid, freetBelongsToUser});