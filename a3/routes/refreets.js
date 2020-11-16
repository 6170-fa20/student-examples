const express = require('express');
const Refreets = require('../models/Refreets');
const Freets = require('../models/Freets');
const Users = require('../models/Users');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

/**
 * Get all the refreets
 * @name GET/api/refreets
 * @return {Refreets[]} - list of freets
 */
router.get('/', (req, res) => {
    const refreets = Refreets.findAll();
    return res.status(200).json(refreets).end();
});

/**
 * Get all the refreets with an associated username
 * @name GET/api/refreets/username/:username 
 * :username is the username of a user
 * @return {Refreets[]} list of refreets with the associated username
 * @throws {404} if the username is not part of any existing user resources
 */
router.get('/:username', (req, res) => {
    if (Users.getOneWithUsername(req.params.username) === undefined) {
        res.status(404).json({error: `Username ${req.params.username} doesn't exist`}).end();
    } else {
        const refreets = Refreets.findAllWithCreator(req.params.username);
        return res.status(200).json(refreets).end();
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
})

/**
 * Create a new refreet
 * @name POST/api/refreets
 * @param {string} id - the unique id of the freet being refreeted 
 * @return {Refreet} the new refreet which is created
 * @throws {400} if id is undefined
 * @throws {404} if there does not exist a freet with id or if the freet associated with freet id is created by the active user
 */
router.post('/', (req, res) => {
    if (req.body.freetId === undefined) {
        res.status(400).json({error: `Please specify a new non-undefined freet id for the refreet`}).end();
    } else if (Freets.findOne(req.body.freetId) === undefined) {
        res.status(404).json({error: `Freet with id ${req.body.freetId} does not exist`}).end();
    } else if (Freets.findOne(req.body.freetId).creator === req.session.username) {
        res.status(404).json({error: `You cannot refreet the freet with id ${req.body.freetId} because you are the original author!`}).end();
    } else {
        const id = uuidv4();
        const refreet = Refreets.addOne(id, req.body.freetId, req.session.username);
        console.log(`added refreet ${JSON.stringify(refreet)}`);
        res.status(200).json(refreet).end();
    }
});

/**
 * Delete an existing refreet
 * @name DELETE/api/refreets/:id
 * :id is the id field of the refreet that will be deleted
 * @return {Freet} the deleted refreet 
 * @throws {404} if there does not exist a refreet with id
 * @throws {403} if the refreet associated with id was not created by the active user
 */
router.delete('/:id', (req, res) => {
    if (Refreets.findOne(req.params.id) === undefined) {
        res.status(404).json({error: `There does not exist a refreet with the given id ${req.params.id}`}).end();
    } else if (Refreets.findOneWithCreator(req.params.id, req.session.username) === undefined) {
        res.status(403).json({error: `You do not have permissions to modify this refreet`}).end();
    } else {
        const refreet = Refreets.deleteOneWithCreator(req.params.id, req.session.username);
        res.status(200).json(refreet).end();
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