const express = require("express");

const Freets = require("../models/Freets");
const Users = require("../models/Users");
const { checkSessionActive, checkUserLoggedIn } = require('./helpers');

const router = express.Router();

// 400 error code for empty

/**
 * Create a Freet if the user is logged in
 * @name POST/api/freets
 * @param {string} content - content of the freet as a string where messages are 140 characters or less
 * @return {Freet} - the created Freet object
 */
router.post("/", (req, res) => {
    // make sure user is logged in
    if (checkUserLoggedIn(req, res) === false) return; 

    // make sure user session is still active
    if (checkSessionActive(req, res) === false) return;

    if (req.body.content.length > 140) {
        res.status(400)
            .json({
                error: `Your updated freet must be less than 140 characters long.`
            })
            .end();
        return;
    } else if (!req.body.content.trim()) {
        res.status(400)
            .json({
                error: `Freets must be non-empty`
            })
            .end();
        return;
    }
    
    const currentUser = Users.getUserBySession(req.session.id);
    const freet = Freets.addFreet(req.body.content, currentUser);
    res.status(200)
        .json(freet)
        .end();
});

/**
 * Lists all Freets regardless of author
 * @name GET/api/freets
 * @return {Freet[]} - list of all Freets
 */
router.get("/", (req, res) => {
    const currentUser = Users.getUserBySession(req.session.id);
    const following = Users.getFollowing(currentUser);
    const freets = Freets.findFreetsByFollowing(following).reverse();
    res.status(200)
        .json({ data: freets })
        .end();
});

/**
 * Lists all Freets associated with an author
 * @name GET/api/freets/:author
 * :author is a username (as a string)
 * @return {Freet[]} - list of all Freets associated with the given author
 */
router.get("/:author", (req, res) => {
    const author = req.params.author;
    if (!Users.findOne(author)) {
        res.status(404).json({
            error: `Author with the name: ${author} does not exist!`
        });
        return;
    }
    const currentUser = Users.getUserBySession(req.session.id);
    const following = Users.getFollowing(currentUser);

    if (!(following.has(author))) {
        res.status(403).json({
            error: `You must follow user ${author} to see their Freets!`
        });
        return;
    }

    const freets = Freets.findFreetsByAuthor(author);
    res.status(200)
        .json(freets.reverse())
        .end();
});

/**
 * Updates a Freet if the user is logged in and the Freet associated with the given id exists
 * @name PUT/api/freets/:id
 * :id is the unique ID of the Freet
 * @param {string} content - new content that the user wants to update
 * @return {Freet} - the updated Freet object
 * @throws {404} - if Freet does not exist
 */
router.put("/:id", (req, res) => {
    // make sure user is logged in
    if (checkUserLoggedIn(req, res) === false) return; 

    // make sure user session is still active
    if (checkSessionActive(req, res) === false) return;

    if (req.params.id.length === 0) {
        res.status(404)
            .json({
                error: `Freet ID must be nonempty`
            })
            .end();
        return;
    }

    if (Freets.findFreetByID(req.params.id) === undefined) {
        res.status(404)
            .json({
                error: `The Freet associated with ID ${req.params.id} does not exist.`
            })
            .end();
        return;
    }

    const freet = Freets.findFreetByID(req.params.id);
    const currentUser = Users.getUserBySession(req.session.id);
    if (freet.author !== currentUser || freet.og_author !== currentUser) {
        res.status(403)
            .json({
                error: `You do not have permissions to edit this freet associated with ID ${req.params.id}.`
            })
            .end();
        return;
    }

    if (req.body.content.length > 140) {
        res.status(400)
            .json({
                error: `Your updated freet must be less than 140 characters long.`
            })
            .end();
        return;
    } else if (!req.body.content.trim()) {
        res.status(400)
            .json({
                error: `Freets must be non-empty`
            })
            .end();
        return;
    }
    Freets.updateFreet(req.params.id, req.body.content);
    res.status(200)
        .json(freet)
        .end();
});

/**
 * Deletes a Freet if the user is logged in and the Freet associated with the given id exists
 * @name DELETE/api/freets/:id
 * :id is the unique ID of the Freet
 * @return {Freet} - the deleted Freet object
 * @throws {404} - if Freet does not exist
 */
router.delete("/:id", (req, res) => {
    // make sure user is logged in
    if (checkUserLoggedIn(req, res) === false) return; 

    // make sure user session is still active
    if (checkSessionActive(req, res) === false) return;

    if (req.params.id.length === 0) {
        res.status(404)
            .json({
                error: `Freet ID must be nonempty`
            })
            .end();
        return;
    }

    if (Freets.findFreetByID(req.params.id) === undefined) {
        res.status(404)
            .json({
                error: `The Freet associated with ID ${req.params.id} does not exist.`
            })
            .end();
        return;
    }

    const freet = Freets.findFreetByID(req.params.id);
    const currentUser = Users.getUserBySession(req.session.id);
    if (freet.author !== currentUser) {
        res.status(403)
            .json({
                error: `You do not have permissions to delete this freet associated with ID ${req.params.id}.`
            })
            .end();
        return;
    }

    Freets.deleteFreet(req.params.id);
    res.status(200)
        .json(freet)
        .end();
});

/**
 * Upvotes a Freet if user follows the Freet's author
 * @name POST/api/freets/upvote/:id
 * :id is the unique ID of the Freet
 * @return {Freet} - the Freet object that was upvoted
 * @throws {404} - if Freet does not exist
 * @throws {403} - user does not follow Freet's author and original author
 */
router.post("/upvote/:id", (req, res) => {
    // make sure user is logged in
    if (checkUserLoggedIn(req, res) === false) return; 

    // make sure user session is still active
    if (checkSessionActive(req, res) === false) return;

    if (req.params.id.length === 0) {
        res.status(404)
            .json({
                error: `Freet ID must be nonempty`
            })
            .end();
        return;
    }
    
    if (Freets.findFreetByID(req.params.id) === undefined) {
        res.status(404)
            .json({
                error: `The Freet associated with ID ${req.params.id} does not exist.`
            })
            .end();
        return;
    }
    const freet = Freets.findFreetByID(req.params.id);

    const currentUser = Users.getUserBySession(req.session.id);
    const following = Users.getFollowing(currentUser);
    const author = freet.author;
    if (!(following.has(author)) || !(following.has(freet.og_author))) {
        res.status(403).json({
            error: `You must follow this Freet's author and original author to upvote this Freet!`
        });
        return;
    }
    Freets.upvoteFreet(req.params.id, currentUser);
    res.status(200)
        .json(freet)
        .end();
});

/**
 * Undos Freet upvote if user follows the Freet's author
 * @name DELETE/api/freets/upvote/:id
 * :id is the unique ID of the Freet
 * @return {Freet} - the Freet object to remove an upvote from
 * @throws {404} - if Freet does not exist
 * @throws {403} - user does not follow Freet's author and original author
 */
router.delete("/upvote/:id", (req, res) => {
    // make sure user is logged in
    if (checkUserLoggedIn(req, res) === false) return; 

    // make sure user session is still active
    if (checkSessionActive(req, res) === false) return;

    if (req.params.id.length === 0) {
        res.status(404)
            .json({
                error: `Freet ID must be nonempty`
            })
            .end();
        return;
    }
    
    if (Freets.findFreetByID(req.params.id) === undefined) {
        res.status(404)
            .json({
                error: `The Freet associated with ID ${req.params.id} does not exist.`
            })
            .end();
        return;
    }
    const freet = Freets.findFreetByID(req.params.id);
    const currentUser = Users.getUserBySession(req.session.id);
    const following = Users.getFollowing(currentUser);
    const author = freet.author;
    if (!(following.has(author)) || !(following.has(freet.og_author))) {
        res.status(403).json({
            error: `You are not following this Freet's author and original author!`
        });
        return;
    }
    Freets.undoFreetUpvote(req.params.id, currentUser);
    res.status(200)
        .json(freet)
        .end();
});


/**
 * Refreets a Freet if user follows the Freet's author and original author
 * @name POST/api/freets/upvote/:id
 * :id is the unique ID of the Freet
 * @return {Freet} - the refreet, if successful
 * @throws {404} - if Freet does not exist
 * @throws {403} - user does not follow Freet's author and original author
 * @throws {400} - user trying to refreet a freet that was originally theirs
 */
router.post("/refreet/:id", (req, res) => {
    // make sure user is logged in
    if (checkUserLoggedIn(req, res) === false) return; 

    // make sure user session is still active
    if (checkSessionActive(req, res) === false) return;

    if (req.params.id.length === 0) {
        res.status(404)
            .json({
                error: `Freet ID must be nonempty`
            })
            .end();
        return;
    }
    
    if (Freets.findFreetByID(req.params.id) === undefined) {
        res.status(404)
            .json({
                error: `The Freet associated with ID ${req.params.id} does not exist.`
            })
            .end();
        return;
    }
    const freet = Freets.findFreetByID(req.params.id);

    const currentUser = Users.getUserBySession(req.session.id);
    const following = Users.getFollowing(currentUser);
    const author = freet.author;
    if (!(following.has(author)) || !(following.has(freet.og_author))) {
        res.status(403).json({
            error: `You must follow this Freet's author and original author to refreet this Freet!`
        });
        return;
    }
    const newFreet = Freets.refreetFreet(req.params.id, currentUser);
    if (newFreet === undefined) {
        res.status(400)
            .json({
                error: `You may not refreet your own freet, and you can only refreet a freet once.`
            })
            .end();
    } else {
        res.status(200)
            .json(newFreet)
            .end();
    }
    
});

module.exports = router;
