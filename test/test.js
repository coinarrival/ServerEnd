const chai = require('chai');

const format = require('../bin/utils/format');

// -------------------- Format.js --------------------
describe('User format regex function', () => {
  it('correct username', () => {
    chai.expect(format.username('test_0')).to.equal(true);
    chai.expect(format.username('佚名')).to.equal(true);
  });

  // username length should be [1, 15]
  it('username length mismatch', () => {
    chai.expect(format.username('t123456789012345')).to.equal(false);
    chai.expect(format.username('')).to.equal(false);
  });

  it('username format mismatch', () => {
    // username can't start with number or underline
    chai.expect(format.username('0test')).to.equal(false);
    // username can't include other characters except underline
    chai.expect(format.username('test-test')).to.equal(false);
    chai.expect(format.username('test.test')).to.equal(false);
    chai.expect(format.username('test(test')).to.equal(false);
    chai.expect(format.username('test%test')).to.equal(false);
  });
});

describe('Password format regex function', () => {
  it('correct password', () => {
    chai.expect(format.password('123456789')).to.equal(true);
    chai.expect(format.password('password123')).to.equal(true);
  });

  // password length should  [8, 20]
  it('password length mismatch', () => {
    chai.expect(format.password('1234567')).to.equal(false);
    chai.expect(format.password('123456789012345678901')).to.equal(false);
  });
});

describe('Email format regex function', () => {
  it('correct email', () => {
    chai.expect(format.email('test@test.com')).to.equal(true);
  });

  it('email format mismatch', () => {
    // email should include @
    chai.expect(format.email('testtest.com')).to.equal(false);
    // email should include a domin
    chai.expect(format.email('test@testcom')).to.equal(false);
  });
});

describe('Phone format regex function', () => {
  it('correct phone', () => {
    chai.expect(format.phone('13712345678')).to.equal(true);
  });
  
  // phone number length should be 11
  it('phone length mismatch', () => {
    chai.expect(format.phone('1371234567')).to.equal(false);
    chai.expect(format.phone('137123456789')).to.equal(false);
  });

  it('phone format mismatch', () => {
    // the first number should be 1
    chai.expect(format.phone('23712345678')).to.equal(false);
    // the second number should be 3/4/5/7/8
    chai.expect(format.phone('12712345678')).to.equal(false);
  });
});

describe('Role format regex function', () => {
  it('correct role', () => {
    chai.expect(format.role('student')).to.equal(true);
    chai.expect(format.role('teacher')).to.equal(true);
  });
  
  // role can only be student or teacher currently
  it('role without support', () => {
    chai.expect(format.role('tester')).to.equal(false);
  });
});