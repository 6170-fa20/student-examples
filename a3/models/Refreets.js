const data = [];

/**
 * @typedef Refreet
 * @prop {string} id - the unique id associated with a refreet
 * @prop {string} freetId - the unique id of the freet being refreeted 
 * @prop {string} creator - the username of the user who created the refreet
 * 
 */

/**
 * @class Refreets
 * Stores all the refreets
 * Is exported so that other files have access to the same users, but the rep of Refreets is encapsulated
 */

class Refreets {

    /**
     * Add a refreet
     * @param {string} content - the content of a refreet
     * @param {string} freetId - the unique id of the freet being refreeted 
     * @param {string} creator - the username of the user who created the refreet
     * @return {Refreet} - the created refreet
     */
    static addOne(id, freetId, creator) {
        const refreet = {id, freetId, creator};
        data.push(refreet);
        return {...refreet};
    }

    /**
     * Get all the refreets
     * @return {Refreet[]} - array of all refreets
     */
    static findAll() {
        return [...data];
    }

    /**
     * Find a refreet by id 
     * @param {string} id - the id of the refreet
     * @return {Refreet | undefined} - the found refreet
     */
    static findOne(id) {
        const refreet = data.find(refreet => refreet.id === id);
        return refreet === undefined ? undefined : {...refreet};
    }

    /**
     * Find a refreet by creator and id
     * @param {string} id - the id of the refreet
     * @param {string} creator - the creator of the refreet 
     * @return {Refreet | undefined} - the found refreet
     */
    static findOneWithCreator(id, creator) {
        const refreet = data.find(refreet => refreet.id === id && refreet.creator === creator);
        return refreet === undefined ? undefined : {...refreet};
    }

    /**
     * Modify the creator of a refreet
     * @param {string} id - the id of the refreet
     * @param {string} newCreator - the new creator of the refreet
     * @return {Refreet} - the modified refreet
     */
    static updateOneCreator(id, newCreator) {
        const refreetIndex = data.findIndex(refreet => refreet.id === id);
        const oldRefreet = data[refreetIndex];
        const updatedRefreet = {id, 'freetId': oldRefreet.freetId, 'creator': newCreator};
        data[refreetIndex] = updatedRefreet;
        return {...updatedRefreet};
    }

    /**
     * Delete a refreet by creator
     * @param {string} id - the id of the refreet
     * @param {string} creator - the creator of the refreet
     * @return {Refreet} the deleted refreet
     */
    static deleteOneWithCreator(id, creator) {
        const refreetIndex = data.findIndex(refreet => refreet.id === id && refreet.creator === creator);
        const refreetToRemoved = data[refreetIndex];
        data.splice(refreetIndex, 1);
        return {...refreetToRemoved};
    }

    /**
     * Delete a refreet by creator
     * @param {string} id - the id of the refreet
     * @param {string} creator - the creator of the refreet
     * @return {Refreet} the deleted refreet
     */
    static deleteAllWithFreetId(freetId) {
        const fileteredRefreets = data.filter(refreet => refreet.freetId === freetId);
        fileteredRefreets.forEach(refreet => this.deleteOneWithCreator(refreet.id, refreet.creator))
        return [...fileteredRefreets];
    }

    /**
     * Find refreets with a specified creator
     * @param {*} creator - the creator of the refreets
     * @return {Refreet[]} - array of refreets
     */
    static findAllWithCreator(creator) {
        const refreetsWithCreator = data.filter(refreet => refreet.creator === creator);
        return [...refreetsWithCreator];
    } 
}

module.exports = Refreets;