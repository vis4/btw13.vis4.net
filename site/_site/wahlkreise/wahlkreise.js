
/* wahlkreise */

$(function() {

    
/* commonly used JS snippets */

var classes = {
    'CDU': 'CDU',
    'SPD': 'SPD',
    'FDP': 'FDP',
    'LINKE': 'LIN',
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
            case 'v2-CDU': return function(wk) { return (wk.v2.CDU['08'] / wk.v2.votes['08']) * -1; };
            case 'v2-SPD': return function(wk) { return (wk.v2.SPD['08'] / wk.v2.votes['08']) * -1; };
            case 'v2-FDP': return function(wk) { return (wk.v2.FDP['08'] / wk.v2.votes['08']) * -1; };
            case 'v2-GRU': return function(wk) { return (wk.v2['GRÜNE']['08'] / wk.v2.votes['08']) * -1; };
            case 'v2-LIN': return function(wk) { return (wk.v2.LINKE['08'] / wk.v2.votes['08']) * -1; };
        }
        return null;
    };

    function render(all, sortBy) {
        $('.vis').html('');

        var cont = $('<div />').addClass('wahlkreise').appendTo('.vis');
        var head = $('<div>').addClass('wahlkreis').addClass('header').appendTo(cont);

        $('<div class="name">Wahlkreis</div>')
            .data('sort-by', 'n').appendTo(head);


        var d = $('<div class="win2 win">Zweitstimmen bei Landtagswahl 2008 (%)<br/></div>').appendTo(head);
        $('<div>CDU</div>').data('sort-by', 'v2-CDU').appendTo(d);
        $('<div>SPD</div>').data('sort-by', 'v2-SPD').appendTo(d);
        $('<div>FDP</div>').data('sort-by', 'v2-FDP').appendTo(d);
        $('<div>GRÜ</div>').data('sort-by', 'v2-GRU').appendTo(d);
        $('<div>LIN</div>').data('sort-by', 'v2-LIN').appendTo(d);


        d = $('<div class="win2 win">Zweitstimmen bei Landtagswahl 2013 (%)<br/></div>').appendTo(head);
        $('<div>CDU</div>').data('sort-by', 'v2-CDU').appendTo(d);
        $('<div>SPD</div>').data('sort-by', 'v2-SPD').appendTo(d);
        $('<div>FDP</div>').data('sort-by', 'v2-FDP').appendTo(d);
        $('<div>GRÜ</div>').data('sort-by', 'v2-GRU').appendTo(d);
        $('<div>LIN</div>').data('sort-by', 'v2-LIN').appendTo(d);

        d = $('<div class="win">Gewinner des Direktmandats<br/></div>').appendTo(head);
        $('<div>’98</div>').data('sort-by', 'v1-98').appendTo(d);
        $('<div>’03</div>').data('sort-by', 'v1-03').appendTo(d);
        $('<div>’08</div>').data('sort-by', 'v1-08').appendTo(d);
        $('<div>’13</div>').data('sort-by', 'v1-13').appendTo(d);



        //$('<div class="est">Einwohner</div>').data('sort-by', 'p').appendTo(head);
        $('<div class="est">Sozialvers. Beschäftigte (%)</div>')
            .data('sort-by', 'w').appendTo(head);
        $('<div class="est">∅ Eink.steuer pro Beschäftigten</div>')
            .data('sort-by', 't').appendTo(head);
        
        /*$('<div class="est">Ausländer</div>')
            .data('sort-by', 'f').appendTo(head);*/

        $('*', head)
            .filter(function() { return $(this).data('sort-by'); })
            .addClass('sortable')
            .click(function(e) {
                render(all, getSortBy($(e.target).data('sort-by')));
            });

        $('*', head)
            .filter(function() { return $(this).data('sort-by') == lastSort; })
            .addClass('sorted');

        var wahlkreise = [], minmax = { f: [0,0], t: [9999,0], e: [1,0] };
        $.each(all, function(wknr, wk) {
            wk.nr = wknr;
            if (humanNames[wknr]) wk.n = humanNames[wknr];
            if (wknr != "00") {
                wahlkreise.push(wk);
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
        wahlkreise.sort(function(a,b) {
            return reverse * (sortBy(a) > sortBy(b) ? 1 : -1);
        });

        $.each(wahlkreise, function(i, wk) {
            var wkdiv = $('<div>').addClass('wahlkreis').appendTo(cont);
            wkdiv.append('<div class="name">'+wk.n+'</div>');


            var win = $('<div class="win2 win" />').appendTo(wkdiv);
            var v = [];
            $.each(['CDU','SPD','FDP','GRÜNE','LINKE'], function(i, k) {
                v.push({ k: classes[k], v: 100 * wk.v2[k]['08'] / wk.v2.votes['08'] });
            });
            //v.sort(function(a,b) { return b.v - a.v; });
            $.each(v, function(i, e) {
                $('<div>'+e.v.toFixed(0)+'</div>').addClass(e.k).appendTo(win);
            });

            win = $('<div class="win2 win" />').appendTo(wkdiv);
            v = [];
            $.each(['CDU','SPD','FDP','GRÜNE','LINKE'], function(i, k) {
                v.push({ k: classes[k], v: 100 * wk.v2[k]['13'] / wk.v2.votes['13'] });
            });
            //v.sort(function(a,b) { return b.v - a.v; });
            $.each(v, function(i, e) {
                $('<div>'+e.v.toFixed(0)+'</div>').addClass(e.k).appendTo(win);
            });

            // direktmandate
            win = $('<div class="win" />').appendTo(wkdiv);
            $.each(['98','03','08', '13'], function(i, yr) {
                var v = [], diff;
                $.each(wk.v1, function(key, vals) {
                    if (key == 'votes' || key == 'voters' || key == 'turnout' || key === '' || !vals[yr]) return;
                    v.push({ v: vals[yr], k: key });
                });
                v.sort(function(a,b) { return b.v - a.v; });
                diff = 100 * (v[0].v - v[1].v) / wk.v1.votes[yr];
                wk['v1-diff-'+yr] = diff;
                
                var d = $('<div>+'+(diff).toFixed(diff < 1 ? 1 : 0)+'</div>').addClass(classes[v[0].k]).appendTo(win);
                d.attr('title', diff.toFixed(1).replace('.', ',')+'% Vorsprung vor dem Zweitplatzierten');
                if (diff >= 20) d.addClass('highlight');
            });
            //$('<div>?</div>').appendTo(win);


            //wkdiv.append('<div class="est">'+wk.p+'<div class="bar" style="width:50%"></div></div>');
            $('<div class="est">'+(100*wk.e).toFixed(1)+' %</div>')
                .append('<div class="bar" style="width:'+(100 * (wk.e - minmax.e[0]) / (minmax.e[1] - minmax.e[0]))+'%"></div>')
                .appendTo(wkdiv);
            $('<div class="est">'+wk.t+' €</div>')
                .append('<div class="bar" style="width:'+(100 * (wk.t - minmax.t[0]) / (minmax.t[1] - minmax.t[0]))+'%"></div>')
                .appendTo(wkdiv);
           /*$('<div class="est">'+(100*wk.f).toFixed(1)+' %</div>')
                .append('<div class="bar" style="width:'+(100 * (wk.f - minmax.f[0]) / (minmax.f[1] - minmax.f[0]))+'%"></div>')
                .appendTo(wkdiv);*/
        });

    }

    $.getJSON('/assets/data/all-13.json').done(function(all) {
        render(all, getSortBy('n'));
    });

});