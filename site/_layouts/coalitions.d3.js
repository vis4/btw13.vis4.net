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


    var c = d3.select("#canvas").selectAll("p")
        .data([4, 8, 15, 16, 23, 42]).enter();

    console.log(c);
    c.append("p")
        .text(function(d) { return "I’m number " + d + "!"; });
    c.append("p")
        .text(function(d) { return "I’m number " + d + "!"; });

    //render(elections.length-2);
    //render(elections.length-2);
    //render(elections.length-3);
});