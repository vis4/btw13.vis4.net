// Raphael Easing Formulas

Raphael.easing_formulas['expoInOut'] = function (n, time, beg, diff, dur) {
    dur = 1000;
    time = n*1000;
    beg = 0;
    diff = 1;
    if (time===0) return beg;
    if (time==dur) return beg+diff;
    if ((time/=dur/2) < 1) return diff/2 * Math.pow(2, 10 * (time - 1)) + beg;
    return diff/2 * (-Math.pow(2, -10 * --time) + 2) + beg;
};

Raphael.easing_formulas['expoIn'] = function (n, time, beg, diff, dur) {
    dur = 1000;
    time = n*1000;
    beg = 0;
    diff = 1;
    return (time==0) ? beg : diff * Math.pow(2, 10 * (time/dur - 1)) + beg;
};

Raphael.easing_formulas['expoOut'] = function (n, time, beg, diff, dur) {
    dur = 1000;
    time = n*1000;
    beg = 0;
    diff = 1;
    return (time==dur) ? beg+diff : diff * (-Math.pow(2, -10 * time/dur) + 1) + beg;
};