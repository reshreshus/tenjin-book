const advanceCardSm2 = (stats, q) => {
    let nextInterval;
    const { repetitionsCount, eFactor } = stats;
    let eF = eFactor;
    let today = new Date();
    if (q >= 3) {
        if (repetitionsCount < 1) {
            nextInterval = 1;
        } else if (repetitionsCount === 1) {
            nextInterval = 6;
        } else {
            const previousInterval = stats.interval;
            console.log({eF, previousInterval})
            nextInterval = Math.round(previousInterval * eF);
            // console.log({nextInterval})
        }
        let newEf = eF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        // console.log({newEf})
        stats.eFactor = newEf;
        stats.repetitionsCount++;

        let newDate = today.addDays(nextInterval);
        stats.nextDate = getDate(newDate);
        // console.log({nextDate: stats.nextDate});
    } else {
        stats.repetitionsCount = 0;
        nextInterval = 1;
        if (eF < 1.3) {
            stats.eF = 1.3;
        }
        stats.nextDate = '-1';
    }
    stats.interval = nextInterval;

    return stats;
}

const dateDiffDays = (first, second) => {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to the floor
    return Math.floor((second-first)/(1000*60*60*24));
}

const getDate = (dt = new Date()) => {
    return `${dt.getFullYear()}/${(dt.getMonth() + 1)}/${dt.getDate()}`
    // return dt.toGMTString();
}

// function parseDate(str) {
//     var mdy = str.split('/');
//     return new Date(mdy[2], mdy[0]-1, mdy[1]);
// }

const parseDate = (dateString) => {
    const [year, mongth, day] = dateString.slice('/');
    return new Date(year, mongth, day);
}

/*
    Repeat items using the following intervals:
    I(1):=1
    I(2):=6
    for n>2: I(n):=I(n-1)*EF
    where:
    I(n) - inter-repetition interval after the n-th repetition (in days),
    EF - E-Factor of a given item
    If interval is a fraction, round it up to the nearest integer.
 */
// const nextIntervalSm2 = (n, eF) => {
//     if (n === 1) return 1;
//     if (n === 2) return 6;
//     return eF * nextIntervalSm2(n - 1, eF);
// }

module.exports = {
    advanceCardSm2
}

