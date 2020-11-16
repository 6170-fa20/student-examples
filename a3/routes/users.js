const express = require('express');
const Users = require('../models/Users');
const Freets = require('../models/Freets');
const Refreets = require('../models/Refreets');
const session = require('express-session');

const router = express.Router();

/**
 * Create a new user (account)
 * @name POST/api/users/signup
 */
router.post('/signup', (req, res) => {
    if (isAuthenticated(req)) {
        res.status(400).json({error: `You must log out before signing up`}).end();
    } else if (req.body.username === undefined || req.body.password === undefined) {
        res.status(400).json({error: "Please enter a non-undefined username and password"}).end();
    } else if (Users.getOneWithUsername(req.body.username) !== undefined) {
        console.log(Users.getOneWithUsername(req.body.username));
        res.status(400).json({error: `Username ${req.body.username} already exists, please pick another username`}).end();
    } else {
        const newUser = Users.addOne(req.body.username, req.body.password);
        res.status(200).json(newUser).end();
    }
});

/**
 * Set username and password of the active user as part of the current session
 * @name POST/api/users/login
 */
router.post('/login', (req, res) => {
    if (isAuthenticated(req)) {
        res.status(400).json({error: `You are already logged in`}).end();
    } else if (req.body.username === undefined || req.body.password === undefined) {
        res.status(400).json({error: "Please enter a non-undefined username and password"}).end();
    } else if (Users.getOneWithUsernameAndPassword(req.body.username, req.body.password) === undefined) {
        res.status(400).json({error: `An account with username ${req.body.username} and ${req.body.password} doesn't exist`}).end();
    } else {
        req.session.username = req.body.username;
        req.session.password = req.body.password;
        res.status(200).json({message: `Successfully logged in`}).end();
    }
});

/**
 * Middleware to check if the active user is associated with the current session (logged in) 
 * before calling routes that require authentication
 */
router.use((req, res, next) => {
    if (!isAuthenticated(req)) {
        res.status(403).json({error: "You must be logged in to perform this operation"}).end();
    } else {
        next();
    }
});

/**
 * Delete the current active session
 * @name DELETE/api/users/logout
 */
router.delete('/logout', (req, res) => {
    req.session.destroy()
    res.status(200).json({message: `Successfully logged out`}).end();
});

/**
 * Delete the current active user
 * @name DELETE/api/users
 */
router.delete('/', (req, res) => {
    const currentUsername = req.session.username;
    const currentFreets = Freets.findAllWithCreator(currentUsername);
    currentFreets.forEach(freet => {
        Freets.deleteOneWithCreator(freet.id, currentUsername);
        Refreets.deleteAllWithFreetId(freet.id);
    });
    const currentRefreets = Refreets.findAllWithCreator(currentUsername);
    currentRefreets.forEach(refreet => {
        Refreets.deleteOneWithCreator(refreet.id, currentUsername);
    });
    const currentFollowers = Users.getOneUserFollowers(req.session.username);
    currentFollowers.forEach(follower => {
        Users.deleteOneFollow(follower, req.session.username);
    });
    const upvotedFreetsIds = Freets.findAllUpvotedFreetsByUser(req.session.username);
    upvotedFreetsIds.forEach(id => {
        Freets.deleteUserFromUpvoters(id, req.session.username);
    });
    Users.deleteOne(req.session.username, req.session.password);
    req.session.destroy();
    res.status(200).json({message: `Deleted the account with username ${currentUsername}`});
});

/**
 * Modify a field of the current active user; field is either username or password
 * @name PUT/api/users/:field
 */
router.put('/:field', (req, res) => {
    if (req.params.field === "username") {
        if (req.body.username === undefined) {
            res.status(400).json({error: `Please specify a new non-undefined username`}).end();
        } else {
            const currentFreets = Freets.findAllWithCreator(req.session.username);
            currentFreets.forEach(oldFreet => {
                Freets.updateOneCreator(oldFreet.id, req.body.username);
            });
            const currentRefreets = Refreets.findAllWithCreator(req.session.username);
            currentRefreets.forEach(oldRefreet => {
                Refreets.updateOneCreator(oldRefreet.id, req.body.username);
            });
            const currentFollowers = Users.getOneUserFollowers(req.session.username);
            currentFollowers.forEach(follower => {
                Users.deleteOneFollow(follower, req.session.username);
                Users.addOneFollow(follower, req.body.username);
            });
            const upvotedFreetIds = Freets.findAllUpvotedFreetsByUser(req.session.username);
            upvotedFreetIds.forEach(id => {
                Freets.deleteUserFromUpvoters(id, req.session.username);
                Freets.addUserToUpvoters(id, req.body.username);
            });
            Users.changeOne(req.session.username, req.session.password, req.body.username, req.session.password);
            req.session.username = req.body.username;
            res.status(200).json({message: `Successfully changed username to ${req.session.username}`}).end();
        }
    } else if (req.params.field === "password") {
        if (req.body.password === undefined) {
            res.status(400).json({error: `Please specify a new non-undefined password`}).end();
        } else {
            Users.changeOne(req.session.username, req.session.password, req.session.username, req.body.password);
            req.session.password = req.body.password;
            res.status(200).json({message: `Successfully changed password`}).end();
        }
    } else {
        res.status(400).json({error: "You can only change username or password"}).end();
    }
});

/**
 * Add a following from the current active user to user with a specified username
 * @name PUT/api/users/follow/
 * @param username - the user that the active user wants to follow
 * @throws {400} if username is undefined
 * @throws {404} if there does not exist a user with the specified username, 
 * if the username is the username of the active user, or if the active user already follows the user with the specified username
 */
router.post('/follow/', (req, res) => {
    if (req.body.username === undefined) {
        res.status(400).json({error: `Please specify a new non-undefined username`}).end();
    } else if (Users.getOneWithUsername(req.body.username) === undefined) {
        res.status(404).json({error: `User with username ${req.body.username} does not exist`}).end();
    } else if (req.body.username === req.session.username) {
        res.status(404).json({error: `You cannot follow yourself`}).end();
    } else if (Users.doesFollow(req.session.username, req.body.username)) {
        res.status(404).json({error: `You already follow the user with username ${req.body.username}`}).end();
    } else {
        const newFollowings = Users.addOneFollow(req.session.username, req.body.username);
        res.status(200).json({message: `Successfully followed the user ${req.body.username}, now following ${newFollowings}`}).end();
    }
});

/**
 * Remove a following from the current active user to user with a specified username
 * @name DELETE/api/users/follow/:username
 * :username of the user that the active user wants to unfollow
 * @throws {400} if username is undefined
 * @throws {404} if there does not exist a user with the specified username, 
 * if the username is the username of the active user, or if the active user already doesn't follows the user with the specified username
 */
router.delete('/follow/:username', (req, res) => {
    if (req.params.username === undefined) {
        res.status(400).json({error: `Please specify a new non-undefined username`}).end();
    } else if (Users.getOneWithUsername(req.params.username) === undefined) {
        res.status(404).json({error: `User with username ${req.params.username} does not exist`}).end();
    } else if (req.params.username === req.session.username) {
        res.status(404).json({error: `You cannot unfollow yourself`}).end();
    } else if (Users.doesFollow(req.session.username, req.params.username) === false) {
        res.status(404).json({error: `You do not follow the user with username ${req.params.username}`}).end();
    } else {
        const newFollowings = Users.deleteOneFollow(req.session.username, req.params.username);
        res.status(200).json({message: `Successfully unfollowed the user ${req.params.username}, now following ${newFollowings}`}).end();
    }
});

/**
 * Get the following or followers of the current active user
 * @name GET/api/users/follow/:type
 * :type either 'followers' or 'following'
 * @throws {400} if type is neither 'followers' not 'following'
 */
router.get('/follow/:type', (req, res) => {
    if (req.params.type === undefined) {
        res.status(400).json({error: `Please specify a type for the follows`}).end();
    } else if (req.params.type !== 'following' && req.params.type !== 'followers') {
        res.status(400).json({error: `Type ${req.params.type} can either be 'following' or 'followers'`}).end();
    } else {
        if (req.params.type === "following") {
            res.status(200).json(Users.getOneUserFollowings(req.session.username)).end();
        } else {
            res.status(200).json(Users.getOneUserFollowers(req.session.username)).end();
        }
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