function linspace(startValue, stopValue, nStep) {
    // Useful function to initialize the tRange array
    // It works similarly to MATLAB' linspace
    var arr = [];
    var step = (stopValue - startValue) / (nStep - 1);
    for (var i = 0; i < nStep; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}


function QuestOCreate(tRange) {
    var first_trial_idx = Math.floor(Math.random() * tRange.length); // first intensity value is picked at random

    var Q = {
        trial_idx: 1,
        tRange: tRange,
        tPDF: Array(tRange.length).fill(1 / tRange.length), // uniform priors
        trial_value_idx: first_trial_idx,
        trial_value: tRange[first_trial_idx],
        PF: {
            // these are the parameters of the psychometric function
            alpha: 60, // this is a guess, it is not used for now but could be employed to initialize the priors distribution
            beta: 1,
            gamma: 0.5,
            lambda: 0.01
        },
        // trial_outcome: [true or false]
    }

    return Q
}

function QuestOUpdate(Q) {
    Q.trial_idx += 1;

    // UPDATE PDF
    // use Bayes rule to update the posterior probability density function

    for (iPDF = 0; iPDF < Q.tPDF.length; iPDF++) {
        var pAB = (Q.PF.gamma + (1 - Q.PF.lambda - Q.PF.gamma) / (1 + Math.exp(-Q.PF.beta * (Q.tRange[Q.trial_value_idx] - Q.tRange[iPDF]))));
        if (Q.trial_outcome == false) {
            pAB = 1 - pAB;
        }

        Q.tPDF[iPDF] = Q.tPDF[iPDF] * pAB;
    }

    // PROPOSE NEW INTENSITY VALUE
    // remember to adjust this value to the limits of your equipment if any (e.g. screen refresh rate or luminance resolution).
    // comment and uncomment the lines below to choose from different methods

    // QuestMode : the mode of the PDF
    // var maxPDF = Q.tPDF.reduce(function(a, b) { return Math.max(a, b); });

    // Q.trial_value_idx = Q.tPDF.findIndex(e => e == maxPDF);
    // Q.trial_value = Q.tRange[Q.trial_value_idx];

    //QuestMean : the mean of the PDF
    var sumPDF = Q.tPDF.reduce((a, b) => a + b);
    var wSumRange = []
    for (i = 0; i < Q.tRange.length; i++) {
        wSumRange[i] = Q.tRange[i] * Q.tPDF[i];
    }
    wSumRange = wSumRange.reduce((a, b) => a + b);
    var meanRange = wSumRange / sumPDF;
    var RangeMinusMean = Q.tRange.map(x => Math.abs(x - meanRange));
    var minRange = RangeMinusMean.reduce(function(a, b) { return Math.min(a, b); });
    Q.trial_value_idx = RangeMinusMean.findIndex(e => e == minRange);
    Q.trial_value = Q.tRange[Q.trial_value_idx];

    return Q
}

function QuestOFinish(Q) {
    // Threshold estimate
    var sumPDF = Q.tPDF.reduce((a, b) => a + b);
    var wSumRange = []
    for (i = 0; i < Q.tRange.length; i++) {
        wSumRange[i] = Q.tRange[i] * Q.tPDF[i];
    }
    wSumRange = wSumRange.reduce((a, b) => a + b);
    var meanEstimate = wSumRange / sumPDF;

    // var meanEstimate = Q.trial_value;

    // standard deviation
    var squaredMeanResiduals = Q.tRange.map(x => Math.pow(x - meanEstimate, 2));
    for (i = 0; i < Q.tRange.length; i++) {
        squaredMeanResiduals[i] = squaredMeanResiduals[i] * Q.tPDF[i];
    }
    sumSquaredMeanResiduals = squaredMeanResiduals.reduce((a, b) => a + b);
    sdEstimate = Math.sqrt(sumSquaredMeanResiduals / sumPDF);
    // ThresholdSD = sqrt(sum((tRangeN.^2) .* pTN') / sum(pTN));;

    var ThresholdEstimate = {
        t: meanEstimate,
        sd: sdEstimate
    };

    return ThresholdEstimate
}