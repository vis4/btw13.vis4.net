/* mögliche koalitionen */

$(function() {

    {{ content }}

    var coalitions_ = ["CDU,SPD", "CDU,FDP", "CDU,GRÜNE", "SPD,GRÜNE", "SPD,FDP", "SPD,LINKE", "CDU,FDP,GRÜNE", "SPD,FDP,GRÜNE", "SPD,LINKE,GRÜNE"],
        bars = {},
        _cont = $('#canvas'),
        canvas = Raphael(_cont.get(0)),
        bar_w = 30,
        width = _cont.width(),
        height = _cont.height()-12;

    function render(election_index) {

        var election = elections[election_index];

        var coalitions = [], min_seats = Math.ceil((election.s + 0.5) * 0.5);

        $.each(coalitions_, function(i) {
            var coalition = { id: i, parties: [], seats: 0 };

            $.each(coalitions_[i].split(','), function(p, party) {
                if (election.result[party]) {
                    coalition.parties.push({ name: party, seats: election.result[party].s });
                    coalition.seats += election.result[party].s;
                } else {
                    coalition = null;
                    return false;
                }
            });

            if (coalition) {
                coalition.parties.sort(function(a,b) {
                    return b.seats - a.seats;
                });
                coalitions.push(coalition);
            }
        });
        // add individual parties
        $.each(election.result, function(party) {
            if (election.result[party].s > 0) {
                coalitions.push({
                    seats: election.result[party].s,
                    parties: [{ name: party, seats: election.result[party].s }]
                });
            }
        });
        // sort coalitions
        coalitions.sort(function(a,b) {
            if (a.seats >= min_seats && b.seats >= min_seats) {
                // sort by biggest party first
                if (a.parties[0].seats != b.parties[0].seats) return b.parties[0].seats - a.parties[0].seats;
            }
            return b.seats - a.seats;
        });
        // draw or update grid lines
        var x = 40, y = Math.round(height - min_seats / coalitions[0].seats * height)+0.5;
        canvas.path('M0,'+y+' L'+width+','+y+' L'+width+','+height+' L0,'+height).attr({
            stroke: false,
            fill: '#ccc',
            opacity: 0.15
        });
        canvas.path('M0,'+y+' L'+width+','+y).attr('stroke-dasharray', '- ');
        y = height+0.5;
        canvas.path('M0,'+y+' L'+width+','+y);

        $.each([20, 40, 60, 80, 100].filter(function(s) { return s < min_seats; }), function(i, s) {
            y = Math.round(height - s / coalitions[0].seats * height)+0.5;
            canvas.path('M0,'+y+' L'+width+','+y).attr('stroke', '#ccc');
        });

        // draw bars, or update if exist
        coalitions = coalitions.slice(0,13);
        $.each(coalitions, function(c, coalition) {
            var h = coalition.seats / coalitions[0].seats * height; y = 0;
            if (coalition.seats < min_seats && coalitions[c-1].seats >= min_seats) {
                // introduce large gap
                x += bar_w * 9.5;
            }
            if (bars[coalitions_[coalition.id]]) {

            } else {
                $.each(coalition.parties, function(p, party) {
                    h = Math.round(party.seats / coalitions[0].seats * height);
                    console.log(party, x, height - h - y, bar_w, h);
                    canvas.rect(x, height - h - y, bar_w, h).attr({
                        stroke: false,
                        opacity: 0.9,
                        fill: partyColors[party.name] || ('#ccc' && console.log(party.name))
                    });
                    y += h+1;
                });
                x += Math.round(bar_w * 1.7);
            }
        });

    }

    render(elections.length-2);
    //render(elections.length-2);
    //render(elections.length-3);
});