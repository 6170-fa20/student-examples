/**
 * @typedef Freet
 * @prop {int} id - unique ID identifying one specific freet
 * @prop {string} content - content of the freet as a string where messages are 140 characters or less
 * @prop {string} author - username
 * @prop {string} og_author = username
 * @prop {List[string]} upvotes - usernames that upvoted this freet
 * @prop {List[Freet]} refreets - refreet ids
 */

 /**
 * Returns a closured Freets object that can execute Freet operations
 * Wherever you import this class, you will be accessing the same data.
 */
function Freets() {
    let _data = [];
    let _counter = 0;

    const that = Object.create(Freets.prototype);

    /**
     * Add a Freet
     * @param {string} content - Freet content
     * @param {string} author - Freet user
     * @return {Freet} - returns a created Freet
     */
    that.addFreet = (content, author = null, og_author = null) => {
        const id = _counter.toString();
        const time = Date.now();
        og_author = og_author === null ? author : og_author;
        const freet = { id, content, author, og_author, time, 'upvotes': [], 'refreets': []};
        _counter++;
        _data.push(freet);
        return freet;
    };

    /**
     * Find a Freet by its unqiue ID
     * @param {int} id - ID of the Freet to find
     * @return {Freet | undefined} - Freet object found or undefined
     */
    that.findFreetByID = id => {
        return _data.filter(freet => freet.id === id)[0];
    };

    /**
     * Find all the Freets that are associated with users that the current user is following
     * @param {string} following - set of users that current user is following
     * @return {Freet[] | []} - A list of Freet objects found or empty list
     */
    that.findFreetsByFollowing = (following) => {
        return _data.filter(freet => following.has(freet.author) && following.has(freet.og_author));
    };

    /**
     * Find all the Freets that are associated with an author username.
     * @param {string} author - Author of Freets to find
     * @return {Freet[] | undefined} - A list of Freet objects found or undefined
     */
    that.findFreetsByAuthor = author => {
        return _data.filter(freet => freet.og_author === author);
    };

    /**
     * Return an array of all Freets
     * @return {Freet[]}
     */
    that.findAllFreets = () => {
        return [..._data];
    };

    /**
     * Updates a Freet's content given an ID.
     * @param {string} ID - ID of Freet to update
     * @param {string} content - new content to update
     * @return {Freet | undefined} - updated Freet object
     */
    that.updateFreet = (id, content) => {
        const freet = that.findFreetByID(id);
        freet.content = content;
        return freet;
    };

    /**
     * Deletes a Freet given an ID
     * @param {string} id - ID of Freet to delete
     * @return {Freet | undefined} - deleted Freet object
     */
    that.deleteFreet = id => {
        const freet = that.findFreetByID(id);
        _data = _data.filter(freet => freet.id !== id);
        _data.forEach(freet => {
            freet.refreets = freet.refreets.filter(refreet => refreet.id !== id);
        })
        return freet;
    };

    /**
     * username upvotes a Freet given an ID. a user can only upvote a given Freet once.
     * @param {string} id - ID of Freet to upvote
     * @param {string} username - user that upvotes the Freet
     * @return {Freet} - (possibly) updated Freet
     */
    that.upvoteFreet = (id, username) => {
        const freet = that.findFreetByID(id);
        if (freet.upvotes.indexOf(username) == -1) {
            freet.upvotes.push(username);
        }
        return freet;
    }

    /**
     * User undoes their upvote for a freet. Ignores if user never upvoted in the first place.
     * @param {string} id - ID of Freet to undo upvote
     * @param {string} username - user that is undoing their upvote for the Freet
     * @return {Freet} - (possibly) updated Freet
     */
    that.undoFreetUpvote = (id, username) => {
        const freet = that.findFreetByID(id);
        freet.upvotes = freet.upvotes.filter(u => u != username);
        return freet;
    }

    /**
     * User refreets Freet with given ID
     * Only allowed if user has is neither the author nor original author of the freet and has not refreeted the Freet
     * @param {string} id - ID of Freet to refreet
     * @param {string} username - user refreeting the Freet
     * @return {Freet | undefined} - refreet
     */
    that.refreetFreet = (id, username) => {
        const currFreet = that.findFreetByID(id);
        if (currFreet.author == username || currFreet.og_author === username) {
            return undefined;
        }
        if (currFreet.refreets.filter(freet => freet.author === username).length > 0) {
            return undefined;
        }
        const newFreet = that.addFreet(currFreet.content, username, currFreet.og_author);
        currFreet.refreets.push(newFreet);
        return newFreet; 
    }

    /**
     * Updates a Freet's author given an ID
     * @param {string} id - ID of Freet to update
     * @param {string} newName - new author name to assign ownership of the Freet
     * @return {Freet} - updated Freet object
     */
    that._updateFreetAuthor = (id, newName) => {
        const freet = that.findFreetByID(id);
        freet.author = newName;
        freet.og_author = newName;
        return freet;
    };

    /**
     * Updates a Freet that a user has upvoted
     * @param {string} id - Freet to be updated
     * @param {string} oldName - previous username
     * @param {string} newName - new username
     */
    that._updateFreetUpvotes = (id, oldName, newName) => {
        const freet = that.findFreetByID(id);
        const idx = freet.upvotes.indexOf(oldName);
        if (idx != -1) {
            freet.upvotes[idx] = newName;
        }
    }

    Object.freeze(that);
    return that;
}

module.exports = Freets();
