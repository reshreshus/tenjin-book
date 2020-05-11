const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const { advanceCardSm2 } = require('../srs/algo');
const { testCardsSm2 } = require('./sm2testCards');

describe('algo', function() {
  testCardsSm2.forEach(card => {
    it(card.testText(), function() {
      let result = advanceCardSm2(card.repetitionStatsSm2, card.q);
      assert.equal(result.interval, card.nextInterval);
    })
  });
});

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }