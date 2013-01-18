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

  Common.ElectionSelector = function(data, active, callback, yr) {
    var elsel;
    elsel = $('<div class="election-selector" />').appendTo('#container');
    $.each(data, function(i, item) {
      var a, y;
      y = yr != null ? yr(item) : item;
      a = $('<a><span class="long">' + (y < 80 ? '20' : '19') + '</span>' + y + '</a>');
      a.css({
        'margin-right': 10,
        cursor: 'pointer'
      });
      a.data('index', i);
      a.click(function(evt) {
        var r;
        active = $(evt.target).data('index');
        r = callback(active, evt);
        if (r) {
          $('a', elsel).removeClass('active');
          $(evt.target).addClass('active');
        }
        return null;
      });
      if (i === active) {
        a.addClass('active');
      }
      return elsel.append(a);
    });
    return elsel;
  };

  Common.CityLabels = [
    {
      name: 'Bremen',
      lon: 8.84,
      lat: 53.11
    }, {
      name: 'Hamburg',
      lon: 10.2,
      lat: 53.57
    }, {
      name: 'H',
      lon: 9.76,
      lat: 52.38
    }, {
      name: 'OS',
      lon: 8.03,
      lat: 52.28
    }, {
      name: 'OL',
      lon: 8.2,
      lat: 53.15
    }, {
      name: 'BS',
      lon: 10.53,
      lat: 52.26
    }, {
      name: 'GÖ',
      lon: 9.94,
      lat: 51.53
    }, {
      name: 'WHV',
      lon: 8.10,
      lat: 53.6
    }
  ];

}).call(this);

(function() {

  $(function() {
    var coalitions, lastCoalition, main, thumb_cont, year, years;
    thumb_cont = $('#map-thumbs');
    years = ['98', '03', '08', '13'];
    year = '08';
    main = null;
    lastCoalition = null;
    coalitions = [
      {
        id: 'cdu-fdp',
        name: 'Schwarz-Gelb',
        parties: ['CDU', 'FDP']
      }, {
        id: 'cdu-gruene',
        name: 'Schwarz-Grün',
        parties: ['CDU', 'GRÜNE']
      }, {
        id: 'spd-gruene',
        name: 'Rot-Grün',
        parties: ['SPD', 'GRÜNE']
      }, {
        id: 'cdu-spd',
        name: 'Große Koalition',
        parties: ['CDU', 'SPD']
      }, {
        id: 'jamaika',
        name: 'Jamaika-Koalition',
        parties: ['CDU', 'FDP', 'GRÜNE']
      }, {
        id: 'spd-linke',
        name: 'Rot-Rot',
        parties: ['SPD', 'LINKE']
      }, {
        id: 'spd-linke-gruene',
        name: 'Rot-Rot-Grün',
        parties: ['SPD', 'LINKE', 'GRÜNE']
      }
    ];
    return $.getJSON('/assets/data/all.json', function(data) {
      return $.get('/assets/svg/wk17-alt.svg', function(svg) {
        return $.get('/assets/svg/wk17-small-alt.svg', function(svg2) {
          var elsel, initMaps, updateMaps;
          initMaps = function() {
            var coalition, d, dclick, labels, _i, _len;
            main = $K.map('#map');
            main.setMap(svg);
            main.addLayer('wahlkreise', {
              styles: {
                stroke: '#fff',
                fill: '#ccc'
              }
            });
            labels = function(style) {
              return main.addSymbols({
                type: $K.Label,
                data: Common.CityLabels,
                location: function(d) {
                  return [d.lon, d.lat];
                },
                text: function(d) {
                  return d.name;
                },
                style: style
              });
            };
            labels(function(d) {
              if (d.name.length <= 3) {
                return 'opacity:0.6;stroke:#000;fill:#000;stroke-width:3px;stroke-linejoin:round;font-size:11px;font-weight:bold';
              } else {
                return 'opacity:0.6;stroke:#fff;fill:#fff;stroke-width:3px;stroke-linejoin:round;font-size:11px;';
              }
            });
            labels(function(d) {
              if (d.name.length <= 3) {
                return 'fill:#fff;font-size:11px;font-weight:bold';
              } else {
                return 'fill:#555;font-size:11px;';
              }
            });
            main.addLayer('wahlkreise', {
              name: 'fg',
              styles: {
                fill: '#fff',
                opacity: 0
              }
            });
            $.each(coalitions.slice(0, 5), function(i, coalition) {
              var map, mclick, t;
              t = $('<div class="thumb" />').appendTo(thumb_cont);
              map = $K.map(t, 190, 170);
              t.addClass(coalition.id);
              t.data('map', map);
              map.setMap(svg2, {
                padding: 5
              });
              map.addLayer('wahlkreise', {
                name: 'bg',
                styles: {
                  fill: '#999',
                  stroke: '#999',
                  'stroke-width': 3
                }
              });
              mclick = function() {
                return updateMaps(this.coalition);
              };
              map.addLayer('wahlkreise', {
                click: mclick.bind({
                  coalition: coalition
                }),
                styles: {
                  cursor: 'pointer',
                  stroke: '#fff',
                  'stroke-width': 0,
                  fill: '#ccc'
                }
              });
              t.append('<label>' + coalition.name + '</label>');
              t.css('opacity', 0);
              setTimeout(function() {
                return t.animate({
                  opacity: 1
                });
              }, Math.sqrt(i + 1) * 200);
              return true;
            });
            for (_i = 0, _len = coalitions.length; _i < _len; _i++) {
              coalition = coalitions[_i];
              d = $('<div class="coal">').appendTo($('.other-coalitions'));
              d.addClass(coalition.id);
              $('<div />').addClass('prev').appendTo(d).css({
                background: 'url(/assets/img/' + coalition.id + '.png)'
              });
              d.append('<span>' + coalition.name + '</span>');
              dclick = function() {
                return updateMaps(this.coalition);
              };
              d.click(dclick.bind({
                coalition: coalition
              }));
            }
          };
          updateMaps = function(coalition) {
            lastCoalition = coalition;
            main.getLayer('wahlkreise').applyTexture('/assets/img/' + coalition.id + '.png', function(d) {
              var key, keys, sum, _i, _len;
              keys = coalition.parties;
              sum = 0;
              for (_i = 0, _len = keys.length; _i < _len; _i++) {
                key = keys[_i];
                sum += data[d.id].v2[key][year];
              }
              return sum / data[d.id].v2.votes[year] >= 0.5;
            }, '#ccc');
            main.getLayer('fg').tooltips(function(d) {
              var key, keys, sum, total, tt, v, _i, _len;
              keys = coalition.parties;
              sum = 0;
              tt = '<b>' + d.name + '</b><br />';
              total = data[d.id].v2.votes[year];
              for (_i = 0, _len = keys.length; _i < _len; _i++) {
                key = keys[_i];
                v = data[d.id].v2[key][year];
                sum += v;
                tt += '<div class="tt-other"><b>' + key + ':</b> ' + (100 * v / total).toFixed(1) + '%</div>';
              }
              tt += '<div class="tt-other"><b>Gesamt:</b> ' + (100 * sum / total).toFixed(1) + '%</div>';
              return tt;
            });
            $('.parties').html(coalition.parties.slice(0, -1).join(', ') + ' und ' + coalition.parties.slice(-1)[0]);
            $('.coal').removeClass('active');
            $('.coal.' + coalition.id).addClass('active');
            $('h1.key').html(coalition.parties.join('+'));
            return $.each(coalitions.slice(0, 5), function(i, coalition) {
              var map, t;
              t = $('.thumb.' + coalition.id);
              map = t.data('map');
              return map.getLayer('wahlkreise').style('fill', function(d) {
                var key, keys, sum, _i, _len;
                keys = coalition.parties;
                sum = 0;
                for (_i = 0, _len = keys.length; _i < _len; _i++) {
                  key = keys[_i];
                  sum += data[d.id].v2[key][year];
                }
                if (sum / data[d.id].v2.votes[year] >= 0.5) {
                  return '#999';
                } else {
                  return '#ccc';
                }
              });
            });
          };
          initMaps();
          updateMaps(coalitions[0]);
          return elsel = Common.ElectionSelector(years, 2, function(active) {
            console.log(active);
            if (active < 3) {
              year = years[active];
              updateMaps(lastCoalition);
              return true;
            }
            return false;
          });
        });
      });
    });
  });

}).call(this);
