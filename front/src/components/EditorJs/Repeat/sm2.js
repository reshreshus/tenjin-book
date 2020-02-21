export const getEvaluationOptions = (treeItem, advanceCardContext) => {
    return [
        {
            quality: 1,
            desc: "Totally Wrong",
            color: "#D47E78",
            nextInterval: () => nextIntervalWithQualitySm2(treeItem, 1),
            func: () => advanceCardContext(treeItem.id, 1)
        },
        {
            quality: 2,
            desc: "Wrong",
            color: "#D47E78",
            nextInterval: () => nextIntervalWithQualitySm2(treeItem, 2),
            func: () => advanceCardContext(treeItem.id, 2)
        },
        {
            quality: 3,
            desc: "Alright",
            color: "#8CD794",
            nextInterval: () => nextIntervalWithQualitySm2(treeItem, 3),
            func: () => advanceCardContext(treeItem.id, 3)
        },
        {
            quality: 4,
            desc: "Good",
            color: "#688DED",
            nextInterval: () => nextIntervalWithQualitySm2(treeItem, 4),
            func: () => advanceCardContext(treeItem.id, 4)
        },
        {
            quality: 5,
            desc: "Very Good",
            color: "#688DED",
            nextInterval: () => nextIntervalWithQualitySm2(treeItem, 5),
            func: () => advanceCardContext(treeItem.id, 5)
        },
    ]
};

const funcSm2 = (treeItem, q) => {
    let date = new Date();
    let stats = treeItem.data.repetitionStatsSm2;
    stats.history.push({
        quality: q,
        date: String(date)
    })
    let eF = stats.eFactor;
    let newEf = eF + (0.1-(5-q)*(0.08+(5-q)*0.02));
    stats.repetitionsCount++
    let nextInterval = Math.round(nextIntervalSm2(stats.repetitionsCount, eF));
    if (q < 3) {
        stats.nextDate = '-1';  
    } else {
        let newDate = date.addDays(nextInterval);
        stats.nextDate = newDate.toDateString();
    }
    stats.eFactor = newEf;
}

const nextIntervalWithQualitySm2 = (treeItem, q) => {
    if (q >= 3) {
        let stats = treeItem.data.repetitionStatsSm2;
        return `In ${Math.round(nextIntervalSm2(stats.repetitionsCount + 1, stats.eF))} day(s)`;
    } else {
        return 'today'
    }
}

const nextIntervalSm2 = (n, eF) => {
    if (n === 1) return 1;
    if (n === 2) return 6;
    return eF * nextIntervalSm2(n - 1, eF);
};