const chai = require('chai');

const format = require('../bin/utils/format');

// -------------------- Format.js --------------------
describe('Test for format function', () => {
  it('username', () => {
    chai.expect(format.username('test_0')).to.equal(true);
  });
  it('username', () => {
    chai.expect(format.username('佚名')).to.equal(true);
  });
  // username can't start with number or underline
  it('username', () => {
    chai.expect(format.username('0test')).to.equal(false);
  });
  // username can't include other characters except underline
  it('username', () => {
    chai.expect(format.username('test-test')).to.equal(false);
  });
  // username length should be 1-15
  it('username', () => {
    chai.expect(format.username('t123456789012345')).to.equal(false);
  });

  it('password', () => {
    chai.expect(format.password('123456789')).to.equal(true);
  });
  // password length should >= 8
  it('password', () => {
    chai.expect(format.password('1234567')).to.equal(false);
  });
  // password length should <= 20
  it('password', () => {
    chai.expect(format.password('123456789012345678901')).to.equal(false);
  });

  it('email', () => {
    chai.expect(format.email('test@test.com')).to.equal(true);
  });
  // email should include @
  it('email', () => {
    chai.expect(format.email('testtest.com')).to.equal(false);
  });

  it('phone', () => {
    chai.expect(format.phone('13712345678')).to.equal(true);
  });
  // phone number length should be 11
  it('phone', () => {
    chai.expect(format.phone('1371234567')).to.equal(false);
  });
  // the first number should be 1
  it('phone', () => {
    chai.expect(format.phone('23712345678')).to.equal(false);
  });
  // the second number should be 3/4/5/7/8
  it('phone', () => {
    chai.expect(format.phone('12712345678')).to.equal(false);
  });

  it('role', () => {
    chai.expect(format.role('student')).to.equal(true);
  });
  it('role', () => {
    chai.expect(format.role('teacher')).to.equal(true);
  });
  // role can only be student or teacher currently
  it('role', () => {
    chai.expect(format.role('tester')).to.equal(false);
  });
});