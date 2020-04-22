const advanceCardSm2 = (stats, q, date) => {
    stats.history.push({
        quality: q,
        date: getDate(date)
    });
    let eF = stats.eFactor;
    let newEf = eF + (0.1-(5-q)*(0.08+(5-q)*0.02));
    stats.repetitionsCount++
    let nextInterval = Math.round(nextIntervalSm2(stats.repetitionsCount, eF));
    if (q < 3) {
        stats.nextDate = '-1';
    } else {
        let newDate = date.addDays(nextInterval);
        stats.nextDate = getDate(newDate);
    }
    stats.eFactor = newEf;
    return stats;
}

const getDate = (dt = new Date()) => {
    return `${dt.getFullYear()}/${(dt.getMonth() + 1)}/${dt.getDate()}`
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
const nextIntervalSm2 = (n, eF) => {
    if (n === 1) return 1;
    if (n === 2) return 6;
    return eF * nextIntervalSm2(n - 1, eF);
}

module.exports = {
    nextIntervalSm2,
    advanceCardSm2
}

