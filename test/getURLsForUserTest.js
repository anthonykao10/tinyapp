const { assert } = require('chai');
const { getURLsForUser } = require('../helpers');

testURLs = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "aJ48lW"
  }
};

describe('getURLSForUser', () => {
  it('should return an object of urls created by the given user ID', () => {
    const urls = getURLsForUser('aJ48lW', testURLs);
    const expectedOutput = {
      "b2xVn2": "http://www.lighthouselabs.ca",
      "9sm5xK": "http://www.google.com"
    };
    assert.deepEqual(urls, expectedOutput);
  });

  it('should return an empty object when given a user that has no created urls', () => {
    const urls = getURLsForUser('testUser', testURLs);
    assert.deepEqual(urls, {});
  });
});