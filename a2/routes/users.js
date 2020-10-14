const express = require('express');
const { v4: uuidv4 } = require('uuid');

const Users = require('../models/Users');
const Fritters = require('../models/Fritters');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

const router = express.Router();

// POST /api/users
// {
//   "username":"username",
//   "password":"password" 
// }
router.post('/', auth.enforceSignedOut,
                validation.usernameDefined, validation.passwordDefined, validation.usernameValid, validation.usernameNotTaken, validation.passwordValid,
    (req, res) => {
        const userID = uuidv4(); // this ID is internal so it's okay for it to be a long string
        const username = req.body.username;
        const password = req.body.password;
        
        const account = Users.addOne(userID, username, password);
        res.status(200).json({message: "Account created succesfully!"});
    }
);

router.use(auth.enforceSignedIn);

// DELETE /api/users
// {}
router.delete('/', validation.userIdExists, (req, res) => {
    const id = req.session.userID;
    Users.deleteOneById(id);
    Fritters.deleteAllByAuthorId(id);
    req.session.userID = undefined;
    res.status(200).json({message: "Account successfully deleted"}).end();
});

// used for both Change Username and Change Password (can even support both, even though the UI doesn't)
// we chose PUT over PATCH because you can technically use this to replace the whole resource from the user perspective.
// Also, PATCH requires giving instructions which doesn't quite match this.
// PUT is also idempotent, as is this function

// PUT /api/users
// each body field is optional but at least 1 must be specified
// {
//  (optional) "username": "newUsername",
//  (optional) "password": "newPassword"
// }
router.put('/', validation.userIdExists, validation.usernameOrPasswordDefined, validation.usernameValid, validation.passwordValid, validation.usernameNotTaken,
    (req, res) => {
        const userID = req.session.userID;
        Users.updateOne(userID, {newUsername: req.body.username, newPassword: req.body.password});
        res.status(200).json({message: "Account successfully updated"}).end();
    }
);

module.exports = Object.freeze(router);