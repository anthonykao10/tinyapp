/**
 * Return a string of 6 random alpha-numeric char's
 */
exports.generateRandomString = function() {
  const values = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let output = '';
  for (let i = 0; i < 6; i++) {
    let randomIdx = Math.floor((Math.random() * 61) + 1);
    output += values[randomIdx];
  }
  return output;
};

/**
 * Given an email, returns uid if exists, false otherwise
 * @param {string} email
 * @return {string|boolean}
 */
exports.getUIDFromEmail = function(email, database) {
  for (uid in database) {
    if (database[uid].email === email) return uid;
  }
  return false;
};

/**
 * Returns the URLs in urlDatabase that were created by a user
 * @param {string} uid
 * @return {object} Object of keys: 'shortURL', vals: 'longURL'
 */
exports.getURLsForUser = function(uid, database) {
  const output = {};
  for (url in database) {
    if (database[url].userID === uid) {
      output[url] = database[url].longURL;
    }
  }
  return output;
};