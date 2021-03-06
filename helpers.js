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
exports.getUserByEmail = function(email, database) {
  for (const uid in database) {
    if (database[uid].email === email) return database[uid];
  }
  return undefined;
};

/**
 * Returns the URLs in urlDatabase that were created by a user
 * @param {string} uid
 * @return {object} Object of keys: 'shortURL', vals: 'longURL'
 */
exports.getURLsForUser = function(uid, database) {
  const output = {};
  for (const url in database) {
    if (database[url].userID === uid) {
      output[url] = database[url].longURL;
    }
  }
  return output;
};

/**
 * Adds a visitor to "visitors obj" (of a "url obj") and set value (frequency) to 1.
 * (If visitor exists in object, increment value).
 * @param {string} uid
 * @param {string} shortURL
 * @param {object} database
 * @return {object} visitors
 */
exports.addVisitor = function(uid, shortURL, database) {
  const visitors = database[shortURL].visitors;
  visitors[uid] = visitors[uid] ? ++visitors[uid] : 1;
  return visitors;
};