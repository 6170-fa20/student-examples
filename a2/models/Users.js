// keeping simple with the expectation that this will later be transitioned to a more persistent data structure (e.g. SQL rows)
let data = [];

class Users {
    static addOne(userID, username, password) {
        const user = {userID, username, password};
        data.push(user);
        return user;
    }

    static findOneByUsername(username) {
        return data.filter(user => user.username === username)[0];
    }

    static findOneByID(userID) {
        return data.filter(user => user.userID === userID)[0];
    }

    // do we need this? might just be a security concern tbh. probably will write about that in the reflection anyway tho
    static findAll() {
        return data;
    }

    // grab from list and mutate reference directly; no need to modify list
    static updateOne(userID, {newUsername = undefined, newPassword = undefined} = {}) {
        const user = Users.findOneByID(userID);
        if (newUsername !== undefined) user.username = newUsername;
        if (newPassword !== undefined) user.password = newPassword;
        return user;
    }

    static deleteOneById(userID) {
        const user = Users.findOneByID(userID);
        data = data.filter(user => user.userID !== userID);
        return user;
    }
}

module.exports = Object.freeze(Users);