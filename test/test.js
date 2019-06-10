const chai = require('chai');

const format = require('../bin/utils/format');

// -------------------- Format.js --------------------
describe('Test for format function', () => {
  it('username', () => {
    chai.expect(format.username('test')).to.equal(true);
  });
  it('password', () => {
    chai.expect(format.username('test')).to.equal(true);
  });
  it('email', () => {
    chai.expect(format.email('test')).to.equal(true);
  });
  it('phone', () => {
    chai.expect(format.phone('test')).to.equal(true);
  });
});