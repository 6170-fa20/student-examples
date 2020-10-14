const express = require('express');

const Fritters = require('../models/Fritters');
const Users = require('../models/Users');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

const router = express.Router();

// takes a list of freets with internal rep (author ID, freet ID, content)
// outputs a list of freets with external rep (author username, freet ID, content)
let externalizeFreets = (freets) => {
    return freets.map(freet => ({"author": Users.findOneByID(freet.authorID).username, "id": freet.id, "content": freet.content}));
};

// view all freets:
// GET /api/freets

// view all freets by author:
// GET /api/freets/authors/:username

router.get('/', (req, res) => {
    const allFreets = Fritters.findAll();
    res.status(200).json(externalizeFreets(allFreets)).end();
});

// the question mark technically means that the `username` parameter is optional, but one of the validation middlewares will make sure it's defined
// we had to include this question mark for the edge case where the user submits an empty string to the UI (which GETs /api/freets/authors/)
router.get('/authors/:username?', validation.usernameDefined, validation.usernameValid, validation.usernameExists,
    (req, res) => {
        // if username doesn't exist, should this error or just return an empty list?
        // empty list seems simpler
        const author = Users.findOneByUsername(req.params.username);
        const freetsFromAuthor = Fritters.findAllByAuthorId(author.userID);
        res.status(200).json(externalizeFreets(freetsFromAuthor)).end();
    }
);

// user authentication middleware for CRUD ops (e.g. any op below)
// specifically this just checks if the user is logged in at all


// all ops below this middleware require sign in
router.use(auth.enforceSignedIn);

// create a freet:
// POST /api/freets
// {
//  "content":"content"
// }

router.post('/', validation.freetContentDefined, validation.freetContentValid,
    (req, res) => {
        const userID = req.session.userID
        const Content = req.body.content;
        // console.log(req.body)
        // const userID = req.session.userID;
        const account = Fritters.addOne(userID, Content);
        res.status(200).json({message: "Freet posted succesfully!"});
    }
);


// edit a freet:
// PUT /api/freets/:id
// {
//  "content": "content"  
// }
router.put('/:id?', validation.freetIdDefined, validation.freetIdValid, validation.freetExists, validation.freetBelongsToUser, validation.freetContentDefined, validation.freetContentValid,
    (req, res) => {
        const freetID = req.body.id;
        Fritters.updateOne(freetID, req.body.content);
        res.status(200).json({message: "Freet successfully updated"}).end();
    }
);


// delete a freet:
// DELETE /api/freets/:id
// {}

router.delete('/:id?', validation.freetIdDefined, validation.freetIdValid, validation.freetExists, validation.freetBelongsToUser,
(req, res) => {
    const freetID = req.params.id || req.body.id;
    Fritters.deleteOne(freetID);
    res.status(200).json({message: "Freet successfully removed"}).end();
})

module.exports = Object.freeze(router);