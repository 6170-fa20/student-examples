// keeping simple with the expectation that this will later be transitioned to a more persistent data structure (e.g. SQL rows)
let data = [];

// using our own counter instead of uuid so that freet IDs are simple and easy for repeating
// if we were doing data persistence, we would load this count from the database
let counter = 0;

class Fritters {
    static addOne(authorID, content) {
        const freet = {authorID, content, id: counter};
        data.push(freet);
        counter += 1;
        return freet;
    }

    static findOne(freetID) {
        return data.filter(fritter => fritter.id === parseInt(freetID))[0];
    }

    static findAll() {
        return data;
    }

    static findAllByAuthorId(authorID) {
        return data.filter(fritter => fritter.authorID === authorID);
    }

    static updateOne(freetID, content) {
        const fritter = data.filter(fritt => fritt.id === parseInt(freetID))[0];
        fritter.content = content;
        return fritter;
    }

    static deleteOne(freetID) {
        data = data.filter(freet => freet.id !== parseInt(freetID));
    }

    static deleteAllByAuthorId(authorID) {
        data = data.filter(freet => freet.authorID !== authorID);
    }
}

module.exports = Object.freeze(Fritters);
