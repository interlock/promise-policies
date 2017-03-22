const Policy = require('../lib/policy');
const expect = require('chai').expect;

describe("default policy", function() {
  it('creates with default actions', function() {
    const base = Policy.Policy.createDefaultPolicy();
    expect(base).to.have.property('create');
    expect(base).to.have.property('read');
    expect(base).to.have.property('update');
    expect(base).to.have.property('delete');
  });

  it('creates with custom actions', function() {
    const base = Policy.Policy.createDefaultPolicy(['public']);
    expect(base).to.have.property('public');
  });

  it('actions return DENY symbol by default', function() {
    const base = Policy.Policy.createDefaultPolicy(['public']);
    expect(base.public()).to.eq(Policy.CODES.DENY);
  });
});