const data = [];

/**
 * @typedef Freet
 * @prop {string} id - the unique id associated with a freet
 * @prop {string} content - the content of a freet
 * @prop {string} creator - the usernmae of the user who created the freet
 * @prop {string{}} upvoters - set of usernames of users who have upvoted the freet 
 * 
 */

/**
 * @class Freets
 * Stores all the freets
 * Is exported so that other files have access to the same users, but the rep of Freets is encapsulated
 */

class Freets {
    /**
     * Add a freet
     * @param {string} content - the content of a freet
     * @param {string} id - the unique id associated with a freet
     * @param {string} creator - the usernmae of the user who created the freet
     * @param {string{}} upvoters - set of usernames of users who have upvoted the freet, empty set if not specified
     * @return {Freet} - the created freet
     */
    static addOne(content, id, creator, upvoters = new Set()) {
        const freet = {id, content, creator, upvoters};
        data.push(freet);
        return this.copyFreet(freet);
    }

    /**
     * Get all the freets
     * @return {Freet[]} - array of all freets
     */
    static findAll() {
        const copyOfData = data.map(freet => this.copyFreet(freet));
        return copyOfData;
    }

    /**
     * Find a freet by id 
     * @param {string} id - the id of the freet
     * @return {Freet | undefined} - the found freet
     */
    static findOne(id) {
        const freet = data.find(freet => freet.id === id);
        return freet === undefined ? undefined : this.copyFreet(freet);
    }

    /**
     * Find a freet by creator and id
     * @param {string} id - the id of the freet
     * @param {string} creator - the creator of the freet 
     * @return {Freet | undefined} - the found freet
     */
    static findOneWithCreator(id, creator) {
        const freet = data.find(freet => freet.id === id && freet.creator === creator);
        return freet === undefined ? undefined : this.copyFreet(freet);
    }

    /**
     * Modify the creator of a freet
     * @param {string} id - the id of the freet
     * @param {string} newCreator - the new creator of the freet
     * @return {Freet} - the modified freet
     */
    static updateOneCreator(id, newCreator) {
        const freetIndex = data.findIndex(freet => freet.id === id);
        const oldFreet = data[freetIndex];
        const updatedFreet = {id, 'content': oldFreet.content, 'creator': newCreator, 'upvoters': oldFreet.upvoters};
        data[freetIndex] = updatedFreet;
        return this.copyFreet(updatedFreet);
    }

    /**
     * Modify the content of a freet
     * @param {string} id - the id of the freet
     * @param {string} newContent - the new content of the freet
     * @return {Freet} - the modified freet
     */
    static updateOneContent(id, newContent) {
        const freetIndex = data.findIndex(freet => freet.id === id);
        const oldFreet = data[freetIndex];
        const updatedFreet = {id, 'content': newContent, 'creator': oldFreet.creator, 'upvoters': oldFreet.upvoters};
        data[freetIndex] = updatedFreet;
        return this.copyFreet(updatedFreet);
    }

    /**
     * Delete a freet by creator
     * @param {string} id - the id of the freet
     * @param {string} creator - the creator of the freet
     * @return {Freet} the deleted freet
     */
    static deleteOneWithCreator(id, creator) {
        const freetIndex = data.findIndex(freet => freet.id === id && freet.creator === creator);
        const freetToRemoved = data[freetIndex];
        data.splice(freetIndex, 1);
        return this.copyFreet(freetToRemoved);
    }

    /**
     * Find freets with a specified creator
     * @param {*} creator - the creator of the freets
     * @return {Freet[]} - array of freets
     */
    static findAllWithCreator(creator) {
        const freetsWithCreator = data.filter(freet => freet.creator === creator);
        return freetsWithCreator.map(freet => this.copyFreet(freet));
    }

    /**
     * Check if a user has upvoted a freet
     * @param {string} id - the id of the freet 
     * @param {string} username - the username of the user
     * @return {boolean} - true if the user has upvoted a freet
     */
    static isAnUpvoter(id, username) {
        const hasUpvoted = data.find(freet => freet.id === id).upvoters.has(username);
        return hasUpvoted;
    }


    /**
     * Add a username to the upvoters of the freet
     * @param {string} id - the id of the freet 
     * @param {string} username - the username of the user
     * @return {string[]} - array of the new usernames of users who are upvoters of the freet
     */
    static addUserToUpvoters(id, username) {
        const freet = data.find(freet => freet.id === id);
        freet.upvoters.add(username);
        console.log(data);
        return Array.from(freet.upvoters.keys());
    }

    /**
     * Remove a username from the upvoters of the freet
     * @param {string} id - the id of the freet
     * @param {string} username - the username of the user
     * @return {string[]} - array of remaining usernames of users who are upvoters of the freet
     */
    static deleteUserFromUpvoters(id, username) {
        const freet = data.find(freet => freet.id === id);
        freet.upvoters.delete(username);
        console.log(data);
        return Array.from(freet.upvoters.keys());
    }

    /**
     * Find all freets upvoted by a user
     * @param {string} username - the username of the user
     * @return {string[]} - array of the freet ids corresponding to the freets upvoted by a user
     */
    static findAllUpvotedFreetsByUser(username) {
        const freets = data.filter(freet => freet.upvoters.has(username));
        const freetIds = freets.map(freet => freet.id)
        return freetIds
    }

    /**
     * Returns a copy of a freet
     * @param {Freet} freet 
     * @return copy of freet
     */
    static copyFreet(freet) {
        const copyOfFreet = {
            'id': freet.id,
            'content': freet.content,  
            'creator': freet.creator, 
            'upvoters': Array.from(freet.upvoters.keys())
        };
        return copyOfFreet;
    }
}

module.exports = Freets;