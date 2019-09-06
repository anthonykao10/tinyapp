const { assert } = require('chai');
const { addVisitor } = require('../helpers');

const testURLs  = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW",
    totalVisits: 12,
    visitors: {},
    uniqueVisits: 0
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "aJ48lW",
    totalVisits: 10,
    visitors: {
      "aJ48lW": 1
    },
    uniqueVisits: 1
  }
};

describe('addVisitor', () => {
  it('should return an object of visitors with user "uid" added to it (count of 1), when starting with an empty visitors object', () => {
    const visitors = addVisitor("aJ48lW", "b2xVn2", testURLs);
    const expectedOutput = {
      "aJ48lW": 1
    };
    assert.deepEqual(visitors, expectedOutput);
  });

  it('should not add the same visitor twice, but just increments the count (value)', () => {
    const visitors = addVisitor("aJ48lW", "9sm5xK", testURLs);
    const expectedOutput = {
      "aJ48lW": 2
    };
    assert.deepEqual(visitors, expectedOutput);
  });
});