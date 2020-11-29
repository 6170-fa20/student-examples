const express = require('express');
const Users = require('../models/Users');
const { checkSessionActive, checkUserLoggedIn } = require('./helpers');

const router = express.Router();


/**
 * Create a user.
 * @name POST/api/users/
 * @param {string} username - name of user 
 * @param {string} password - password of user
 * @return {User} - the created user
 * @throws {400} - if name is already taken
 */
router.post('/', (req, res) => {
  if (req.session.username !== undefined && req.session.username !== null ) {
    res.status(400).json({ error: 'Please sign out to make a new account.' }).end();
    return;
  }
  if (req.body.username.length === 0 || req.body.password.length === 0) {
    res.status(400).json({
      error: `Username and password must be nonempty`,
    }).end();
  } else {
    if (Users.findOne(req.body.username) === undefined) {
      const user = Users.addOne(req.body.username, req.body.password); 
      res.status(200).json({ message: `User ${user} has been created` }).end();
    } else {
      res.status(400).json({
        error: `The username "${req.body.username}" has already been taken.`,
      }).end();
    }
  }
});

/**
 * Update user's name
 * @name PUT/api/users/username
 * @param {string} username - new name of user 
 * @return {User} - the new username
 * @throws {400} - if name is already taken 
 * @throws {401} - if attempting to update username while not logged in
 */
router.put('/username', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 

  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;


  if (Users.findOne(req.body.username) !== undefined) {
    if (req.session.username === req.body.username) {
      res.status(400).json({
        error: `This your current username.`,
      }).end();
    } else {
      res.status(400).json({
        error: `This username is already taken.`,
      }).end();
    }
  } else {
    const user = Users.updateName(req.session.username, req.body.username, req.session.id);
    req.session.username = user;
    res.status(200).json({ message: `Your new user name is: ${user}` }).end();
  }
});

/**
 * Update user's password
 * @name PUT/api/users/password
 * @param {string} password - new name of user 
 * @throws {401} - if attempting to update password while not logged in
 */
router.put('/password', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 

  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;

  Users.updatePassword(req.session.username, req.body.password, req.session.id); 
  res.status(200).json({ message: `Your password has been changed.` }).end();
});


/**
 * Login the user to be able to post and delete tweets
 * @name POST/api/users/signin
 * @param {string} username - name of user 
 * @param {string} password - password of user 
 * @return {User} - the new username
 * @throws {400} - if name is already taken 
 */
router.post('/auth', (req, res) => {
  // make sure user is not logged in
  if (req.session.username === undefined || req.session.username === null) {
    if (req.body.username.length === 0 || req.body.password.length === 0) {
      res.status(400).json({ error: 'The user name and password must both be at least 1 character.' }).end();
    } else {
      if (Users.authenticateUser(req.body.username, req.body.password, req.session.id) === true) {
        req.session.username = req.body.username;
        res.status(200).json({ name: `${req.session.username}` }).end();
      } else {
        res.status(400).json({ error: 'Your name or password is incorrect' }).end();
      }
    }
  } else {
    res.status(400).json({ error: 'You are already signed in.' }).end();
  }
});

/**
 * Logout the user from their current session
 * @name DELETE/api/users/auth
 * @throws {401} - if attempting to logout while not logged in
 */
router.delete('/auth', (req, res) => {
    // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  Users.logout(req.session.id);
  req.session.destroy();
  res.status(200).json( {message: `Successfully signed out.`}).end();
});

/**
 * Delete a user.
 * @name DELETE/api/users
 * @param {string} name - name of user 
 * @param {string} password - password of user
 * @return {User} - the created user
 * @throws {400} - if name is already taken
 */
router.delete('/', (req, res) => {
  const currentUser = Users.getUserBySession(req.session.id)

  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  
  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;
  
  Users.deleteUser(req.session.id);
  req.session.destroy();
  res.status(200).json({
    message: `Successfully deleted account. You have been signed out. Please make a new account to post Freets.`
  }).end();
});

/**
 * Get list of users that the current user is not following.
 * @name GET/api/users
 * @param {string} name - name of user 
 * @param {string} password - password of user
 * @return {User} - the created user
 * @throws {400} - if name is already taken
 */
router.get('/', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  
  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;
  
  const users = Users.getNotFollowing(req.session.username);

  res.status(200).json({
    users: Array.from(users)
  }).end();
});

/**
 * Get list of user's followers
 * @name GET/api/users
 * @param {string} name - name of user 
 * @return {Array} - list of followers
 */
router.get('/followers', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  
  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;
  const followers = Users.getFollowers(req.session.username);

  res.status(200).json({
    followers: Array.from(followers)
  }).end();
});

/**
 * Get list of user's following
 * @name GET/api/users
 * @param {string} name - name of user 
 * @return {Array} - list of followers
 */
router.get('/following', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  
  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;
  
  const following = Users.getFollowing(req.session.username);

  res.status(200).json({
    following: Array.from(following)
  }).end();
});

/**
 * Return a list of user's follower requests
 * @name GET/api/users/requests
 * @return {Set} - all follower requests
 */
router.get('/requests', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  
  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;

  const requests = Users.getFollowRequests(req.session.id);
  res.status(200).json({
    requests: Array.from(requests)
  }).end();
  return;
});

/**
 * Removes a follower from another user's list of  followers 
 * @name PUT/api/users/requests
 * @param {string} followingUser - name of user being followed
 * @return {User} - the followed user
 * @throws {400} - if user doesn't exist or invalid request
 */
router.put('/requests', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  
  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;

  // making unfollow request
  const unfollowUsername = req.body.unfollowUsername;
  const followerUsername = req.body.followerUsername;
  const currentUser = Users.getUserBySession(req.session.id)
  // unfollower a user
  if (unfollowUsername !== undefined) {
      // make sure user exists
      if (Users.findOne(unfollowUsername) === undefined) {
        res.status(400).json({
          error: `User ${unfollowUsername} does not exist`
        }).end();
        return;
      }

      if (Users.findOne(unfollowUsername) === currentUser) {
        res.status(400).json({
          error: `You cannot unfollow yourself`
        }).end();
        return;
      }
      // make sure user is currently following specified username
      const followers = Users.getFollowers(unfollowUsername);
      
      if (!(followers.has(currentUser))) {
        res.status(400).json({
          error: `You are not following ${unfollowUsername}`
        }).end();
        return;
      }

      const user = Users.unfollowerUser(unfollowUsername, req.session.id);
    
      res.status(200).json({
        message: `You have unfollowed user ${user}`
      }).end();
  } else if (followerUsername !== undefined) { // remove a user from a user's follower list
      // make sure user exists
      if (Users.findOne(followerUsername) === undefined) {
        res.status(400).json({
          error: `User ${followerUsername} does not exist`
        }).end();
        return;
      }

      // make sure user is currently following specified username
      const currentUser = Users.getUserBySession(req.session.id)
      const followers = Users.getFollowers(currentUser);
      if (!(followers.has(followerUsername))) {
        res.status(400).json({
          error: `User ${followerUsername} is not following you`
        }).end();
        return;
      }
      if (Users.findOne(followerUsername) === currentUser) {
        res.status(400).json({
          error: `You cannot remove yourself`
        }).end();
        return;
      }
      const user = Users.removeFollower(followerUsername, req.session.id);
    
      res.status(200).json({
        message: `User ${user} is no longer following you`
      }).end();
  } else {
    res.status(400).json({
      message: `Invalid username`
    }).end();
  }

})


/**
 * Add a follower to another user's list of requested followers 
 * or approve/reject another user's request
 * @name POST/api/users/requests
 * @param {string} followingUser - name of user being followed
 * @return {User} - the followed user
 * @throws {400} - if name is already taken
 */
router.post('/requests', (req, res) => {
  // make sure user is logged in
  if (checkUserLoggedIn(req, res) === false) return; 
  
  // make sure user session is still active
  if (checkSessionActive(req, res) === false) return;

  // making follow request
  const followUsername = req.body.followUsername;
  const currentUser =Users.getUserBySession(req.session.id);
  if (followUsername !== undefined) {
      // make sure user exists
      if (Users.findOne(followUsername) === undefined) {
        res.status(400).json({
          error: `User ${followUsername} does not exist`
        }).end();
        return;
      }

      if (Users.getFollowers(followUsername).has(currentUser)) {
        res.status(400).json({
          error: `You already follow ${followUsername}`
        }).end();
        return;
      }
      const followingUser = followUsername;
      const user = Users.addFollowRequest(followingUser, req.session.id);
    
      res.status(200).json({
        message: `You have sent a follow request to ${user}`
      }).end();
  } else {
    // approve or reject follow request
    const approveID = req.body.approveID;
    const rejectID = req.body.rejectID;
    if (approveID === undefined) {
      // do nothing
    } else if (Users.findOne(approveID) === undefined) {
      res.status(400).json({
        error: `User ${approveID} does not exist`
      }).end();
      return;
    } else {

      const user = Users.approveFollowerRequest(approveID, req.session.id);
        res.status(200).json({
          message: `User ${user} is now following you`
        }).end();
        return;
    }
    if (rejectID === undefined) {
      return;
    }
    else if (Users.findOne(rejectID) === undefined) {
      res.status(400).json({
        error: `User ${rejectID} does not exist`
      }).end();
      return;
    } else {
      const user = Users.rejectFollowerRequest(rejectID, req.session.id);
      res.status(200).json({
        message: `You have rejected ${user}'s follow request`
      }).end();
      return;
    }

  }
});


module.exports = router;
