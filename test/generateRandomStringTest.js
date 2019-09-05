const { assert } = require('chai');
const { generateRandomString } = require('../helpers');

describe('generateRandomString', () => {
  it('should return a string', () => {
    const generatedType = typeof generateRandomString();
    assert.equal(typeof generatedType, 'string');
  });

  it('should return a string of 6 characters', () => {
    const generatedLength = generateRandomString().length;
    assert.deepEqual(generatedLength, 6);
  });
});