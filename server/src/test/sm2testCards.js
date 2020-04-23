const testCardsSm2 = [
    {
        "q": 1,
        "repetitionStatsSm2": {
            "eFactor": 2.5,
            "repetitionsCount": 0,
            "nextDate": "-1",
            "interval": 0
        },
        "nextInterval": 1,
        "nextEFactor": "",
        "testText": function() {
            return `q = ${this.q}, nextInterval=${this.nextInterval}, nextEFactor=${this.nextEFactor}`
        }
    },
]

module.exports = {
    testCardsSm2
}