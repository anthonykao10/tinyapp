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
exports.getUIDFromEmail = function(email) {
  for (uid in users) {
    if (users[uid].email === email) return uid;
  }
  return false;
};