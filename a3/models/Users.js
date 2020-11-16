const users = [];

/**
 * @typedef User
 * @prop {string} username - username of the user
 * @prop {string} password - password of the user
 * @prop {string} following - set of usernames of the users that the user follows
 * 
 */

/**
 * @class Users
 * Stores all the users and their followings
 * Is exported so that other files have access to the same users, but the rep of Users is encapsulated
 */
class Users {
    /**
     * Add a user
     * @param {string} username 
     * @param {string} password 
     * @return {User} the added user
     */
    static addOne(username, password) {
        const newUser = {username, password, 'following': new Set()};
        users.push(newUser);
        return {...newUser};
    }

    /**
     * Get a user by username
     * @param {string} username - username of user to find
     * @return {User | undefined} - found username
     */
    static getOneWithUsername(username) {
        const existingUser = users.find(user => user.username === username);
        return existingUser === undefined ? undefined : {...existingUser};
    }

    /**
     * Get a user by username and password
     * @param {string} username - username of user to find
     * @param {string} password - password of user to find
     * @return {User | undefined} - found username
     */
    static getOneWithUsernameAndPassword(username, password) {
        const existingUser = users.find(user => user.username === username && user.password === password);
        return existingUser === undefined ? undefined : {...existingUser};
    }

    /**
     * Get all the users
     * @return {User[]}
     */
    static getAll() {
        return [...users];
    }

    /**
     * Delete a user by username and password, the user must exist
     * @param {string} username - username of user to delete
     * @param {string} password - password of user to delete
     * @return {User} the deleted user
     */
    static deleteOne(username, password) {
        const existingUserIndex = users.findIndex(user => user.username === username && user.password === password);
        const existingUser = users[existingUserIndex];
        users.splice(existingUserIndex, 1);
        return existingUser === undefined ? undefined : {...existingUser};
    }

    /**
     * Modify the username and password of a user
     * @param {string} username - current username
     * @param {string} password - current password
     * @param {string} newUsername - new username
     * @param {string} newPassword - new password
     * @return {User} the modified user
     */
    static changeOne(username, password, newUsername, newPassword) {
        const oldUser = this.deleteOne(username, password);
        const newUser = this.addOne(newUsername, newPassword);
        return {...newUser};
    }

    /**
     * Check if user1 follows user2
     * @param {string} username - username of user1
     * @param {*} followingUsername - username of user2
     * @return {true} if user1 follows user2
     */
    static doesFollow(username, followingUsername) {
        const follows = Users.getOneWithUsername(username).following.has(followingUsername);
        console.log(Users.getOneWithUsername(username));
        return follows;
    }

    /**
     * Add user2 to the following of user1
     * @param {string} username - username of user1
     * @param {*} followingUsername - username of user2
     * @return {string[] users that user1 follows
     */
    static addOneFollow(username, followingUsername) {
        const currentUser = users.find(user => user.username == username);
        currentUser.following.add(followingUsername);
        console.log(users);
        return Array.from(currentUser.following.keys());
    }

    /**
     * Delete user2 from the following of user1
     * @param {string} username - username of user1
     * @param {*} followingUsername - username of user2
     * @return {string[] users that user1 follows
     */
    static deleteOneFollow(username, followingUsername) {
        const currentUser = users.find(user => user.username == username);
        currentUser.following.delete(followingUsername);
        return Array.from(currentUser.following.keys());
    }

    /**
     * Get the users that a particular user follows
     * @param {string} username - username of the user
     * @return {string[]} the usernames of all the users that user is following
     */
    static getOneUserFollowings(username) {
        const currentUser = Users.getOneWithUsername(username);
        return Array.from(currentUser.following.keys());
    }

    /**
     * Get the followers of a user
     * @param {string} username - username of the user
     * @return {string[]} the usernames of all the users that follow the user
     */
    static getOneUserFollowers(username) {
        const followers = users.filter(user => user.following.has(username));
        const followersNames = followers.map(follower => follower.username);
        return followersNames;
    }
}

module.exports = Users;