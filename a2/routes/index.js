const express = require('express');

const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const Users = require('../models/Users');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Fritter' });
});

// separating signin and signout from /api/users because it's a distinct functionality
// We acknowledge this isn't quite "restful" because we aren't working with a resource on the server side
// however, these operations update user sessions. we considered using a resource url like /api/session for login information but
// we decided against it because we didn't want to reveal internal representation (e.g. using sessions to identify user state).
// POSTing a signin or signout update feels more simple, natural and intuitive

// POST /signin
// {
//  "username":"username",
//  "password":"password"
// }

router.post('/signin', auth.enforceSignedOut,
                        validation.usernameDefined, validation.passwordDefined, validation.usernameValid, validation.passwordValid, validation.usernameExists, validation.passwordValid, validation.passwordCorrect,
          (req, res) => {
            const account = Users.findOneByUsername(req.body.username);
            req.session.userID = account.userID;
            res.status(200).json({message: `Successfully logged in! Welcome ${req.body.username}.`}).end(); 
          }
);

// no validation needed to sign out. this just clears some info from the session
// (again, not quite restful, but simple and intuitive for the user experience)

// POST /signout
// {}
router.post('/signout', auth.enforceSignedIn,
          (req, res) => {
            req.session.userID = undefined;
            // we don't say their name on Goodbye for security reasons (e.g. if they were logged in on a public computer)
            res.status(200).json({message: "Successfully logged out."}).end(); 
          }
);

module.exports = Object.freeze(router);
