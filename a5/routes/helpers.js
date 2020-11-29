const Users = require('../models/Users');

/**
 * Helper function for checking whether user's session is still active 
 * This means that the user still exists on the server
 * 
 * @param {string} username - name of user 
 * @return {Boolean} - true if session is still active, false otherwise
 * @throws {401} - if session expired
 */
function checkSessionActive(req, res) {
    if (Users.findOne(req.session.username) === undefined) {
      res.status(401).json({
        error: `Your session has expired. Please login again.`,
      }).end();
      req.session.destroy();
      return false; 
    }
    return true; 
  }
  
  
/**
 * Helper function for checking whether user is logged in
 * @param {string} username - name of user 
 * @return {Boolean} - true if user is logged in, false otherwise
 * @throws {401} - if user not logged in
 */
function checkUserLoggedIn(req, res) {
if (req.session.username === undefined || req.session.username === null) {
    res.status(401).json({
    error: `You must be logged in to perform this operation`,
    }).end();
    return false; 
}
return true; 
}
  
module.exports = { checkSessionActive, checkUserLoggedIn }