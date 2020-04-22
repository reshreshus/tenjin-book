const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const { nextIntervalSm2 } = require('../srs/algo');

describe('algo', function() {
    it('next interval should be a number', function() {
        let n = getRandomInt(1, 20);
        let eF = 2.5;
        let result = nextIntervalSm2(n, eF);
        console.log({result})
        expect(result).to.be.a('number')
    })
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}