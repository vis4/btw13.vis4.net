
/* wahlkreise, dreispaltig */

$(function() {

    
/* commonly used JS snippets */

var classes = {
    'CDU': 'CDU',
    'SPD': 'SPD',
    'FDP': 'FDP',
    'LPDS': 'LIN',
    'GRÜNE': 'GRU',
    'PIRATEN': 'PIR'
},

partyColors = {
    CDU: '#222222',
    SPD: '#E2001A',
    GRÜNE: '#1FA12D',
    FDP: '#FBEE31',
    LINKE: '#8B1C62'
},

humanNames = {
    '01-03': 'Braunschweig<sup>1</sup>',
    '24-28': 'Hannover<sup>2</sup>'
};


    var

    reverse = 1,
    lastSort = '',

    getSortBy = function(sort) {
        reverse = sort == lastSort ? reverse * -1 : 1;
        lastSort = sort;
        switch (sort) {
            case 'n': return function(wk) { return wk.n; };
            case 'p': return function(wk) { return wk.p * -1; };
            case 't': return function(wk) { return wk.t*-1; };
            case 'f': return function(wk) { return isNaN(wk.f) ? 0 : Number(wk.f)*-1; };
            case 'w': return function(wk) { return Number(wk.e)*-1; };
            case 'v1-98': return function(wk) { return wk['v1-diff-98']; };
            case 'v1-03': return function(wk) { return wk['v1-diff-03']; };
            case 'v1-08': return function(wk) { return wk['v1-diff-08']; };
            case 'v2-CDU': return function(wk) { return (wk.v2.CDU['08'] / wk.v2.total['08']) * -1; };
            case 'v2-SPD': return function(wk) { return (wk.v2.SPD['08'] / wk.v2.total['08']) * -1; };
            case 'v2-FDP': return function(wk) { return (wk.v2.FDP['08'] / wk.v2.total['08']) * -1; };
            case 'v2-GRU': return function(wk) { return (wk.v2['GRÜNE']['08'] / wk.v2.total['08']) * -1; };
            case 'v2-LIN': return function(wk) { return (wk.v2.LPDS['08'] / wk.v2.total['08']) * -1; };
        }
        return null;
    };

    function render(column, districts) {
        var cont = $('.'+column+' .wks');

        cont.html('');

        $.each(districts, function(i, wk) {
            var wkdiv = $('<div>').addClass('wahlkreis').appendTo(cont);
            wkdiv.append('<div class="name">'+wk.n+'</div>');
            var win = $('<div class="win" />').appendTo(wkdiv);

            $.each(['03','08'], function(i, yr) {
                var v = [], diff;
                $.each(wk.v1, function(key, vals) {
                    if (key == 'total' || key === '' || !vals[yr]) return;
                    v.push({ v: vals[yr], k: key });
                });
                v.sort(function(a,b) { return b.v - a.v; });
                diff = 100 * (v[0].v - v[1].v) / wk.v1.total[yr];
                wk['v1-diff-'+yr] = diff;
                var d = $('<div>+'+(diff).toFixed(diff < 1 ? 1 : 0)+'</div>').addClass(classes[v[0].k]).appendTo(win);
                if (diff >= 20) d.addClass('highlight');
            });
            $('<div>?</div>').appendTo(win);
        });

    }

    function probablyCDU(wk) {
        return (wk.v1.CDU['08'] - wk.v1.SPD['08']) / wk.v1.total['08'] > 0.05;
    }

    function probablySPD(wk) {
        return (wk.v1.CDU['08'] - wk.v1.SPD['08']) / wk.v1.total['08'] < -0.05;
    }

    function swinging(wk) {
        return Math.abs((wk.v1.CDU['08'] - wk.v1.SPD['08']) / wk.v1.total['08']) <= 0.05;
    }

    $.getJSON('/assets/data/all.json').done(function(all) {
        var districts = [];
        var minmax = { f: [0,0], t: [9999,0], e: [1,0] };
        $.each(all, function(wknr, wk) {
            wk.nr = wknr;
            if (humanNames[wknr]) wk.n = humanNames[wknr];
            if (wknr != "00") {
                districts.push(wk);
                if (!isNaN(wk.f)) {
                    minmax.f[0] = Math.min(minmax.f[0], wk.f);
                    minmax.f[1] = Math.max(minmax.f[1], wk.f);
                }
                minmax.t[0] = Math.min(minmax.t[0], wk.t);
                minmax.t[1] = Math.max(minmax.t[1], wk.t);
                minmax.e[0] = Math.min(minmax.e[0], wk.e);
                minmax.e[1] = Math.max(minmax.e[1], wk.e);
            }
        });
        render('left', districts.filter(probablyCDU));
        render('center', districts.filter(swinging));
        render('right', districts.filter(probablySPD));
    });

});