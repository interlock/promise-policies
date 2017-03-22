const Policy = require('../lib/policy');
const expect = require('chai').expect;

const resolver = require('../lib/resolver');

const basePolicy = Policy.Policy.createDefaultPolicy(['read', 'create', 'delete']);

class testPolicy extends basePolicy {
  static read(subject, context) {
    if (context.allow) return Promise.resolve(Policy.CODES.ALLOW);
    return Promise.resolve(Policy.CODES.DENY);
  }

  static create(subject, context) {
    return Policy.CODES.DENY;
  }
}

const testResolver = resolver((subject) => {
  if (subject === "notfound") {
    return Promise.reject(new Error("not found"));
  }
  return Promise.resolve(testPolicy);
});

describe("resolver", function() {
  it('has lookup', function() {
    expect(testResolver).to.have.property('lookup');
  });

  it('fails if lookup was not provided', function() {
    const badResolver = resolver();
    badResolver.lookup('anything').then((code) => {
      expect(code).to.be.undefined;
    }).catch((err) => {
      expect(err.message).to.eq('lookup must be implemented');
    });
  });

  it('has lookup return a policy', function() {
    return testResolver.lookup('anything').then((policy) => {
      expect(policy).to.eq(testPolicy);
    });
  });

  it('can reject the lookup', function() {
    return testResolver.lookup('notfound').then((policy) => {
      expect(policy).to.be.undefined;
    }).catch((err) => {
      expect(err.message).to.eq('not found');
    });
  });

  it('can ALLOW an action', function() {
    return testResolver.resolve('anything', 'read', {allow: true}).then((code) => {
      expect(code).to.eq(Policy.CODES.ALLOW);
    });
  });

  it('can DENY an action', function() {
    return testResolver.resolve('anything', 'read', {allow: false}).then((code) => {
      expect(code).to.eq(Policy.CODES.DENY);
    });
  });

  it('can handle sync policy', function() {
    return testResolver.resolve('anything', 'create', {allow: false}).then((code) => {
      expect(code).to.eq(Policy.CODES.DENY);
    });
  });

  it('falls through to default policy', function() {
    return testResolver.resolve('anything', 'delete', {allow: false}).then((code) => {
      expect(code).to.eq(Policy.CODES.DENY);
    });
  });

  it('fails on missing action', function() {
    return testResolver.resolve('anything', 'update', {}).then((code) => {
      expect(code).to.be.undefined;
    }).catch((err) => {
      expect(err.message).to.eq('policy does not define action');
    });
  })
});