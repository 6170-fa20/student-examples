const express = require('express');
const Freets = require('../models/Freets');
const Refreets = require('../models/Refreets');
const Users = require('../models/Users');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * Get all the freets
 * @name GET/api/freets
 * @return {Freets[]} - list of freets
 */
router.get('/', (req, res) => {
    const freets = Freets.findAll();
    return res.status(200).json(freets).end();
});

/**
 * Get all the freets upvoted by a particular user
 * @name GET/api/freets/upvote/:username
 * :username is the username of the user
 * @return {Freets[]} list of freets upvoted by user
 */
router.get('/upvote/:username', (req, res) => {
    if (Users.getOneWithUsername(req.params.username) === undefined) {
        res.status(404).json({error: `Username ${req.params.username} doesn't exist`}).end();
    } else {
        const freetIds = Freets.findAllUpvotedFreetsByUser(req.params.username);
        const freets = freetIds.map(id => Freets.findOne(id));
        return res.status(200).json(freets).end();
    }
});

/**
 * Get all the freets with an associated username
 * @name GET/api/freets/username/:username 
 * :username is the username of a user
 * @return {Freets[]} list of shorts with the associated username
 * @throws {404} if the username is not part of any existing user resources
 */
router.get('/:username', (req, res) => {
    if (Users.getOneWithUsername(req.params.username) === undefined) {
        res.status(404).json({error: `Username ${req.params.username} doesn't exist`}).end();
    } else {
        const freets = Freets.findAllWithCreator(req.params.username);
        return res.status(200).json(freets).end();
    }
});

/**
 * Middleware to check if the active user is associated with the current session (logged in) 
 * before calling routes that require authentication
 * @throws {403} if the active user is not logged in
 */
router.use((req, res, next) => {
    if (!isAuthenticated(req)) {
        res.status(403).json({error: "You must be logged in to perform this operation"}).end();
    } else {
        next();
    }
});

/**
 * Delete an upvote of a freet
 * @name DELETE/api/freets/upvote/:id 
 * id of the freet the active user wants to delete their upvote
 * @throws {400} if the id is undefined
 * @throws {404} if there does not exist a freet with the specified id or if the active user has not upvoted the freet with the specied id
 */
router.delete('/upvote/:id', (req, res) => {
    if (req.params.id === undefined) {
        res.status(400).json({error: `Please specify a new non-undefined freet id to delete an upvote for`}).end();
    } else if (Freets.findOne(req.params.id) === undefined) {
        res.status(404).json({error: `Freet with id ${req.params.id} does not exist`}).end();
    } else if (Freets.isAnUpvoter(req.params.id, req.session.username) === false) {
        res.status(404).json({error: `You have not upvoted the freet with id ${req.params.id}`});
    } else {
        const upvoters = Freets.deleteUserFromUpvoters(req.params.id, req.session.username);
        console.log(`upvoters of freet with id ${req.params.id} are ${upvoters}`);
        res.status(200).json({message: `Successfully deleted upvote for freet with id ${req.params.id}`}).end();
    }
});

/**
 * Upvote a freet
 * @name POST/api/freets/upvote
 * @param {string} id - the id of the freet the active user wants to upvote
 * @throws {400} if the id is undefined
 * @throws {404} if there does not exist a freet with the specified id, 
 * if the active user has already upvoted the freet with the specified id
 */
router.post('/upvote/', (req, res) => {
    if (req.body.id === undefined) {
        res.status(400).json({error: `Please specify a new non-undefined freet id to upvote`}).end();
    } else if (Freets.findOne(req.body.id) === undefined) {
        res.status(404).json({error: `Freet with id ${req.body.id} does not exist`}).end();
    } else if (Freets.isAnUpvoter(req.body.id, req.session.username) === true) {
        res.status(404).json({error: `You already upvoted the freet with id ${req.body.id}`});
    } else {
        const upvoters = Freets.addUserToUpvoters(req.body.id, req.session.username);
        console.log(`upvoters of freet with id ${req.body.id} are ${upvoters}`);
        res.status(200).json({message: `Successfully upvoted freet with id ${req.body.id}`}).end();
    }
});

/**
 * Create a new freet
 * @name POST/api/freets
 * @param {string} content - the content of the freet, must be <= 140 characters long
 * @return {Freet} the new freet which is created
 * @throws {400} if content is undefined or empty or defined and > 140 characters long
 */
router.post('/', (req, res) => {
    if (req.body.content === undefined) {
        res.status(400).json({error: `Please specify a new non-undefined content for the freet`}).end();
    } else if (req.body.content === "") {
        res.status(400).json({error: `Please specify a new nonempty content for the freet`}).end();
    } else if (req.body.content.length > 140) {
        res.status(400).json({error: `Your content is ${req.body.content.length} but needs to be less than 140 characters long`}).end();
    } else {
        const id = uuidv4();
        const freet = Freets.addOne(req.body.content, id, req.session.username);
        console.log(`added freet ${JSON.stringify(freet)}`);
        res.status(200).json(freet).end();
    }
});

/**
 * Modify an existing freet
 * @name PUT/api/freets/:id
 * :id is the id field of the freet that will be modified
 * @param {string} content - the content of the freet, must be <= 140 characters long
 * @return {Freet} the modified freet 
 * @throws {404} if there does not exist a freet with id
 * @throws {403} if the freet associated with id was not created by the active user
 * @throws {400} if content is undefined or defined and > 140 characters long
 */ 
router.put('/:id', (req, res) => {
    if (Freets.findOne(req.params.id) === undefined) {
        res.status(404).json({error: `There does not exist a freet with the given id ${req.params.id}`}).end();
    } else if (Freets.findOneWithCreator(req.params.id, req.session.username) === undefined) {
        res.status(403).json({error: `You do not have permissions to modify this freet`}).end();
    } else if (req.body.content === undefined) {
        res.status(400).json({error: `Please specify a new non-undefined content for the freet`}).end();
    } else if (req.body.content.length > 140) {
        res.status(400).json({error: `Your content is ${req.body.content.length} but needs to be less than 140 characters long`}).end();
    } else {
        const freet = Freets.updateOneContent(req.params.id, req.body.content);
        res.status(200).json(freet).end();
    }
});

/**
 * Delete an existing freet
 * @name DELETE/api/freets/:id
 * :id is the id field of the freet that will be deleted
 * @return {Freet} the deleted freet 
 * @throws {404} if there does not exist a freet with id
 * @throws {403} if the freet associated with id was not created by the active user
 */
router.delete('/:id', (req, res) => {
    if (Freets.findOne(req.params.id) === undefined) {
        res.status(404).json({error: `There does not exist a freet with the given id ${req.params.id}`}).end();
    } else if (Freets.findOneWithCreator(req.params.id, req.session.username) === undefined) {
        res.status(403).json({error: `You do not have permissions to modify this freet`}).end();
    } else {
        const freet = Freets.deleteOneWithCreator(req.params.id, req.session.username);
        const deletedRefreets = Refreets.deleteAllWithFreetId(req.params.id);
        res.status(200).json(freet).end();
    }
});

/**
 * Helper function for testing if the active user is authenticated
 * @param {*} req : request
 */
const isAuthenticated = (req) => {
    if (req.session.username !== undefined && req.session.password !== undefined) {
        return true;
    }
    return false;
}

module.exports = router;