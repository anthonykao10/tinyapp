const { assert } = require('chai');
const { getUserByEmail } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail('user@example.com', testUsers).id;
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return a user object when given a valid email', () => {
    const user = getUserByEmail('user2@example.com', testUsers);
    const expectedOutput = testUsers['user2RandomID'];
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined given an invalid email', () => {
    const user = getUserByEmail('invalidUser@invalid.com', testUsers);
    assert.equal(user, undefined);
  });
});