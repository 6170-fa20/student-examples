let enforceSignedIn = (req, res, next) => {
    if (req.session.userID === undefined) {
        res.status(401).json({message: "You must be signed in to perform this action"}).end();
        return;
    }

    next();
};

let enforceSignedOut = (req, res, next) => {
    if (req.session.userID !== undefined) {
        res.status(403).json({message: "You must be signed out to perform this action"}).end();
        return;
    }

    next();
};

module.exports = Object.freeze({enforceSignedIn, enforceSignedOut});