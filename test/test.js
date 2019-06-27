const chai = require('chai');

const format = require('../bin/utils/format');

// -------------------- Format.js --------------------
describe('Test for format function', () => {
  it('username', () => {
    chai.expect(format.username('test')).to.equal(true);
  });
  it('password', () => {
    chai.expect(format.password('123456789')).to.equal(true);
  });
  it('email', () => {
    chai.expect(format.email('test@test.com')).to.equal(true);
  });
  it('phone', () => {
    chai.expect(format.phone('13712345678')).to.equal(true);
  });
});