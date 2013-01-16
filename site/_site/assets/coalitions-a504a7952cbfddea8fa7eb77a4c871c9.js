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
(function() {
  var Common, _ref;

  Common = (_ref = window.Common) != null ? _ref : window.Common = {};

  Common.classes = {
    CDU: 'CDU',
    SPD: 'SPD',
    FDP: 'FDP',
    LPDS: 'LIN',
    GRÜNE: 'GRU',
    PIRATEN: 'PIR'
  };

  Common.partyColors = {
    CDU: '#222222',
    SPD: '#E2001A',
    GRÜNE: '#1FA12D',
    FDP: '#F3E241',
    LINKE: '#8B1C62'
  };

  Common.humanNames = {
    '01-03': 'Braunschweig<sup>1</sup>',
    '24-28': 'Hannover<sup>2</sup>'
  };

}).call(this);

(function() {

  $(function() {
    var bar_w, bg, canvas, elections, get_coalitions, grid, height, partyColors, render, stacked_bars, width, _coalitions, _cont, _lblcont;
    _coalitions = ["CDU,SPD", "CDU,FDP", "CDU,GRÜNE", "SPD,GRÜNE", "SPD,FDP", "SPD,LINKE", "CDU,FDP,GRÜNE", "SPD,FDP,GRÜNE", "SPD,LINKE,GRÜNE"];
    _cont = $('#canvas');
    _lblcont = $('.vis-coalitions');
    canvas = Raphael(_cont.get(0));
    bar_w = 30;
    elections = null;
    width = _cont.width();
    height = _cont.height() - 12;
    stacked_bars = {};
    grid = {};
    bg = null;
    partyColors = Common.partyColors;
    $.fn.set = function(txt) {
      return $('span', this).html(txt);
    };
    get_coalitions = function(election, justParties) {
      var coalitions;
      if (justParties == null) {
        justParties = false;
      }
      coalitions = [];
      console.log(election);
      election.min_seats = Math.ceil((election.s + 0.5) * 0.5);
      $.each(_coalitions, function(i) {
        var coalition;
        coalition = {
          id: i,
          key: _coalitions[i],
          parties: [],
          seats: 0
        };
        $.each(_coalitions[i].split(','), function(p, party) {
          if (election.result[party] && election.result[party].s > 0) {
            coalition.parties.push({
              name: party,
              seats: election.result[party].s
            });
            return coalition.seats += election.result[party].s;
          } else {
            coalition = null;
            return false;
          }
        });
        if (coalition != null) {
          coalition.parties.sort(function(a, b) {
            return b.seats - a.seats;
          });
          return coalitions.push(coalition);
        }
      });
      coalitions = coalitions.filter(function(coalition) {
        var makessense;
        if (coalition.parties.length === 3) {
          makessense = true;
          $.each(coalitions, function(i, c) {
            if (c.parties.length === 2) {
              if (c.parties[0].name === coalition.parties[0].name) {
                if (c.parties[1].name === coalition.parties[1].name || c.parties[1].name === coalition.parties[2].name) {
                  if (c.seats > election.min_seats) {
                    makessense = false;
                    return false;
                  }
                }
              }
            }
          });
          return makessense;
        } else {
          return true;
        }
      });
      if (justParties) {
        coalitions = [];
      }
      $.each(election.result, function(party) {
        if (election.result[party].s > election.min_seats * 0.5 || (justParties && election.result[party].s > 0)) {
          return coalitions.push({
            key: party,
            seats: election.result[party].s,
            parties: [
              {
                name: party,
                seats: election.result[party].s
              }
            ]
          });
        }
      });
      coalitions.sort(function(a, b) {
        if (a.seats >= election.min_seats && b.seats >= election.min_seats) {
          if (a.parties[0].seats !== b.parties[0].seats) {
            return b.parties[0].seats - a.parties[0].seats;
          }
        }
        return b.seats - a.seats;
      });
      return coalitions;
    };
    render = function(election_index, justParties) {
      var bgprops, coalitions, election, init_grid_line, label, move_grid_line, offset, possible, yscale;
      if (justParties == null) {
        justParties = false;
      }
      election = elections[election_index];
      coalitions = get_coalitions(election, justParties);
      bar_w = justParties ? 60 : 30;
      yscale = function(seats) {
        return Math.round(seats / coalitions[0].seats * height);
      };
      label = function(clss, txt) {
        var lbl;
        lbl = $('<div class="label ' + clss + '"><span /></div>');
        _lblcont.append(lbl);
        lbl.css({
          opacity: 0
        });
        if (txt != null) {
          lbl.set(txt);
        }
        return lbl;
      };
      if (!justParties) {
        $('.desc').hide();
      }
      setTimeout(function() {
        return $('.desc').fadeIn(1000);
      }, 2000);
      bar_w = Math.round((width - 220) / coalitions.length / 1.8);
      offset = width - coalitions.length * bar_w * 1.8 - 15;
      if (justParties) {
        bar_w = (width - 340) / coalitions.length / 1.8;
      }
      possible = true;
      $.each(coalitions, function(i, coalition) {
        var sbc, tl, x, y;
        if (!(stacked_bars[coalition.key] != null)) {
          sbc = stacked_bars[coalition.key] = {};
          $.each(coalition.parties, function(j, party) {
            var bar, h, x, y;
            x = 20 + i * bar_w * 1.8;
            if (justParties) {
              x += 340;
            }
            y = 0;
            h = 0;
            bar = canvas.rect(x, height - h - y, bar_w, h);
            bar.attr({
              stroke: coalition.seats > election.min_seats ? '#fff' : '#eee',
              opacity: 0.98,
              fill: partyColors[party.name] || ('#ccc' && console.log(party.name))
            });
            return sbc[party.name] = bar;
          });
          sbc.toplabel = label('bar top center');
          sbc.bottomlabel = label('bar bottom center', coalition.key.replace(/,/g, '<br/>'));
        }
        sbc = stacked_bars[coalition.key];
        y = 0;
        x = Math.round(20 + i * bar_w * 1.8);
        if (coalition.seats < election.min_seats) {
          if (!justParties) {
            x += offset;
          }
          if (possible) {
            $('.desc-impossible').css({
              right: width - x + 10
            });
            $('.desc-possible').css({
              left: x - offset
            });
            possible = false;
          }
        }
        if (justParties) {
          x += 340;
        }
        setTimeout(function() {
          sbc.bottomlabel.animate({
            left: x - 40 + bar_w * 0.5
          });
          return sbc.toplabel.animate({
            left: x - 40 + bar_w * 0.5
          });
        }, 1000);
        setTimeout(function() {
          sbc.bottomlabel.animate({
            opacity: 1
          });
          return sbc.toplabel.animate({
            opacity: 1
          });
        }, 2000);
        $.each(coalition.parties, function(j, party) {
          var bar, barprops, h;
          bar = sbc[party.name];
          h = yscale(party.seats);
          barprops = {
            y: height - h - y - 0.5,
            height: h,
            width: bar_w
          };
          bar.animate(barprops, 1000, 'expoInOut', function() {
            var props;
            props = bar.animate({
              x: x + 0.5
            }, 1000, 'expoInOut');
            return setTimeout(function() {
              return bar.animate({
                opacity: 1
              }, 300);
            }, 1000);
          });
          return y += h;
        });
        sbc.toplabel.animate({
          top: height - y - 22
        });
        if (justParties) {
          tl = coalition.seats;
          sbc.toplabel.removeClass('negative');
        } else {
          tl = coalition.seats - election.min_seats;
          if (tl < 0) {
            sbc.toplabel.addClass('negative');
          } else {
            sbc.toplabel.removeClass('negative');
          }
          if (tl > 0) {
            tl = '+' + tl;
          }
          if (tl === 0) {
            tl = '±' + tl;
          }
        }
        return sbc.toplabel.set(tl);
      });
      $.each(stacked_bars, function(key, bars) {
        var found;
        found = false;
        $.each(coalitions, function(i, coalition) {
          if (coalition.key === key) {
            found = true;
            false;
          }
          return true;
        });
        if (!found) {
          return $.each(bars, function(party, bar) {
            return bar.animate({
              opacity: 0
            }, 300);
          });
        }
      });
      init_grid_line = function(addlbl) {
        var lbl, line;
        if (addlbl == null) {
          addlbl = true;
        }
        line = canvas.path('M0,' + (height - .5) + ' L' + width + ',' + (height - 0.5));
        line.toBack();
        if (addlbl) {
          lbl = label('grid left');
          line.data('lbl', lbl);
          lbl = label('grid right');
          line.data('lbl2', lbl);
        }
        return line;
      };
      move_grid_line = function(line, seats) {
        var animprops, lbl;
        animprops = {
          transform: 't0,' + (0 - yscale(seats))
        };
        line.animate(animprops, '800', 'expoInOut');
        if (line.data('lbl') != null) {
          lbl = line.data('lbl');
          lbl.set(seats);
          lbl.animate({
            opacity: 1,
            top: height - yscale(seats) - 8
          });
          lbl = line.data('lbl2');
          lbl.set(seats);
          lbl.animate({
            opacity: 1,
            top: height - yscale(seats) - 8
          });
        }
      };
      if (!(grid.min_seats != null)) {
        grid.min_seats = init_grid_line();
        grid.min_seats.data('lbl').addClass('min-seats');
        grid.min_seats.data('lbl2').addClass('min-seats');
        grid.bottom = init_grid_line(false);
      }
      grid.bottom.toFront();
      move_grid_line(grid.min_seats, election.min_seats);
      $.each([20, 40, 60, 80, 100], function(i, seats) {
        var lineprops;
        if (!(grid[seats] != null)) {
          grid[seats] = init_grid_line();
          grid[seats].attr({
            'stroke-dasharray': '- '
          });
        }
        move_grid_line(grid[seats], seats);
        lineprops = {
          opacity: seats + 5 < election.min_seats ? 1 : 0
        };
        grid[seats].animate(lineprops, 500);
        grid[seats].data('lbl').animate(lineprops);
        return grid[seats].data('lbl2').animate(lineprops);
      });
      if (!(bg != null)) {
        bg = canvas.rect(0, height - 1, width, 1);
        bg.attr({
          fill: '#f5f5f5',
          stroke: false
        });
        bg.toBack();
      }
      bgprops = {
        y: height - yscale(election.min_seats),
        height: yscale(election.min_seats),
        opacity: 1
      };
      if (justParties) {
        $('.desc-intro').show();
        $('.desc-impossible, .desc-possible, .label.left').hide();
        return bg.animate({
          opacity: 0
        });
      } else {
        $('.desc-intro').hide();
        $('.desc-impossible, .desc-possible, .label.left').show();
        return bg.animate(bgprops, 800, 'expoInOut');
      }
    };
    return $.ajax({
      url: '/assets/data/elections-nds.json',
      dataType: 'json'
    }).done(function(json) {
      var active, elsel, justParties;
      elections = json;
      active = elections.length - 1;
      justParties = true;
      elsel = $('<div class="election-selector" />').appendTo(_lblcont);
      $.each(elections, function(i, election) {
        var a;
        a = $('<a><span class="long">' + (election.yr < 80 ? '20' : '19') + '</span>' + election.yr + '</a>');
        a.css({
          'margin-right': 10,
          cursor: 'pointer'
        });
        a.data('index', i);
        a.click(function(evt) {
          $('a', elsel).removeClass('active');
          $(evt.target).addClass('active');
          active = $(evt.target).data('index');
          return render(active, justParties);
        });
        if (i === active) {
          a.addClass('active');
        }
        return elsel.append(a);
      });
      $('button').click(function() {
        justParties = false;
        return render(active, justParties);
      });
      return render(active, justParties);
    });
  });

}).call(this);
