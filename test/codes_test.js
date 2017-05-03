const Policy = require('../lib');
const expect = require('chai').expect;

describe("codes", function() {

  ['ALLOW','DENY'].forEach((code) => {
    it(`has ${code}`, () => {
      expect(Policy.CODES[code]).to.exist;
    });

    it(`is a global symbol for ${code}`, () => {
      expect(Policy.CODES[code]).to.eq(Symbol.for(code));
    })
  });


});
