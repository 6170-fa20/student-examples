const Freets = require("../models/Freets");



/**
 * @typedef User
 * @prop {string} name - some unique user name string
 * @prop {string} password - user password
 * @prop {string} sessionID - user sessionID
 */

/**
 * Returns a closured Users object that can execute user operations
 * Stores all users.
 * Wherever you import this class, you will be accessing the same data.
 */
function Users() {
  const data = {
    userA: {'pw': 'userA', 'following': new Set(['userA', 'userB', 'userC']), 'followedBy': new Set(['userA', 'userB', 'userC']), 'requested': new Set(['userD', 'userE']) },
    userB: {'pw': 'userB', 'following': new Set(['userA', 'userB']), 'followedBy': new Set(['userA', 'userB']), 'requested': new Set() },
    userC: {'pw': 'userC', 'following': new Set(['userA', 'userC']), 'followedBy': new Set(['userA', 'userC']), 'requested': new Set() },
    userD: {'pw': 'userD', 'following': new Set(['userD']), 'followedBy': new Set(['userD']), 'requested': new Set() },
    userE: {'pw': 'userE', 'following': new Set(['userE']), 'followedBy': new Set(['userE']), 'requested': new Set() },
  };
  const sessions = {};

  const that = Object.create(Users.prototype);

  /**
   * Add a user.
   * @param {string} name - user name
   * @param {string} password - user password
   * @return {string} - name of created user
   */
  that.addOne = (name, password) => {
    data[name] = {'pw': password, 'following': new Set([name]), 'followedBy': new Set([name]), 'requested': new Set()};
    return name;
  }

  /**
   * Find a user by Name.
   * @param {string} name - name of user to find
   * @return {string | undefined} - found user
   */
  that.findOne = (name) => {
    if (name in data) return name;
    return undefined;
  }

  /**
   * Gets the set of all users
   * @return {Set} - set of all names
   */
  that.getUsers = () => {
    return Object.keys(data);
  }

  /**
   * Returns the name associated with the session id
   * @param {string} sessionID 
   * @return {string} - username
   */
  that.getUserBySession = sessionID => {
    return sessions[sessionID];
  }

  /**
   * Get the follow requests for a user
   * @param {string} sessionID
   * @return {string} - name of the followed user
   */
  that.getFollowRequests = (sessionID) => {
    const currentUser = sessions[sessionID];
    return new Set(data[currentUser].requested);
  }

  /**
   * Removes the user of the current session from their desired user's followers list
   * @param {string} followedUser 
   * @param {string} sessionID 
   * @return {string} - name of the followed user
   */
  that.unfollowerUser = (followedUser, sessionID) => {
    const currentUser = sessions[sessionID];
    data[followedUser].followedBy.delete(currentUser);
    data[currentUser].following.delete(followedUser);
    return followedUser;
  }

  /**
   * Removes a user from the current user's list of followers
   * @param {string} followingUser 
   * @param {string} sessionID 
   * @return {string} - name of the following user
   */
  that.removeFollower = (followingUser, sessionID) => {
    const currentUser = sessions[sessionID];
    data[currentUser].followedBy.delete(followingUser);
    data[followingUser].following.delete(currentUser);
    return followingUser;
  }

  /**
   * Add the user of the current session to their desired user's follow request list
   * @param {string} followingUser 
   * @param {string} sessionID
   * @return {string} - name of the followed user
   */
  that.addFollowRequest = (followingUser, sessionID) => {
    const currentUser = sessions[sessionID];
    data[followingUser].requested.add(currentUser);
    return followingUser;
  }

  /**
   * Add a user to the follower list of the user in the current session
   * @param {string} follower 
   * @param {string} sessionID
   * @return {string} - name of the followed user
   */
  that.approveFollowerRequest = (follower, sessionID) => {
    const currentUser = sessions[sessionID];
    data[currentUser].followedBy.add(follower);
    data[currentUser].requested.delete(follower);
    data[follower].following.add(currentUser);
    return follower;
  }

  /**
   * Reject a user from being added to the follower list of the user in the current session
   * @param {string} follower 
   * @param {string} sessionID
   * @return {string} - name of the followed user
   */
  that.rejectFollowerRequest = (follower, sessionID) => {
    const currentUser = sessions[sessionID];
    data[currentUser].requested.delete(follower);
    return follower;
  }


  /**
   * Gets the set of followers for a user
   * @param {string} user 
   * @return {string | undefined} - new set of followers
   */
  that.getFollowers = (user) => {
    if (!(user in data)) return undefined;
    return new Set(data[user].followedBy);
  }

  /**
   * Gets the set of following for a user
   * @param {string} user 
   * @return {string | undefined} - new set of following
   */
  that.getFollowing = (user) => {
    if (!(user in data)) return undefined;
    return new Set(data[user].following);
  }

  /**
   * Gets the set of not following for a user
   * @param {string} user 
   * @return {string | undefined} - new set of following
   */
  that.getNotFollowing = (user) => {
    if (!(user in data)) return undefined;
    let following = new Set(data[user].following);
    let allusers = new Set(Object.keys(data));
    let notFollowing = [...allusers].filter(x => !following.has(x));
    return new Set(notFollowing);
  }

  /**
   * Update a user name.
   * @param {string} name - name of user to update
   * @param {string} newName - new name
   * @return {string | undefined} - name of updated user
   */
  that.updateName = (name, newName, sessionID) => {
    const freetsAssociatedWithOldName = Freets.findFreetsByAuthor(name);
    freetsAssociatedWithOldName.forEach(freet => {
      Freets._updateFreetAuthor(freet.id, newName);
      Freets._updateFreetUpvotes(freet.id, name, newName);
    });
    const user = that.findOne(name);
    data[newName] = Object.assign({}, data[user])
    for (const user in data) {
      const following = data[user].following;
      const followedBy = data[user].followedBy;
      if (following.has(name)) { 
        following.delete(name);
        following.add(newName);
      }
      if (followedBy.has(name)) {
        followedBy.delete(name);
        followedBy.add(newName);
      }
    };
    sessions[sessionID] = newName;
    that.deleteUser(name);
    return newName;
  }

  /**
   * Update a user password.
   * @param {string} name - name of user to update
   * @param {string} newPw - new password
   * @return {string | undefined} - name of updated user
   */
  that.updatePassword = (name, newPw) => {
    const user = that.findOne(name);
    data[user].pw = newPw;
    return user;
  }

  /**
   * Delete a user 
   * @param {string} sessionID - user sessionID
   * @return {string | undefined} - deleted user
   */
  that.deleteUser = (sessionID) => {
    const name = sessions[sessionID];
    if (name !== undefined) {
      delete data[name];
      delete sessions[sessionID]
    }
    for (const user in data) {
      const following = data[user].following;
      const followedBy = data[user].followedBy;
      if (following.has(name)) { 
        following.delete(name);
      }
      if (followedBy.has(name)) {
        followedBy.delete(name);
      }
    };
    const freetsAssociatedWithName = Freets.findFreetsByAuthor(name);
    freetsAssociatedWithName.forEach(freet => {
      Freets.deleteFreet(freet.id);
    });

    return name;
  }

  /**
   * Removes a user session
   * @param {string} sessionID
   * @return {string} - deleted session id 
   */
  that.logout = (sessionID) => {
    delete sessions[sessionID];
    return sessionID;
  }

  /**
   * Authenticate a user
   * @param {string} name - name of user to authenticate
   * @param {string} password - password of user to authenticate
   * @param {string} sessionID - user sessionID
   * @return {true | false} - whether the user's credentials are correct
   */
  that.authenticateUser = (name, password, sessionID) => {
    const user = that.findOne(name);

    if (user !== undefined) {
        if (data[user].pw === password) {
            sessions[sessionID] = name;
            return true;
        }
    }
    return false
  }
  Object.freeze(that);
  return that;
}

module.exports = Users();