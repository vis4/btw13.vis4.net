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
  var barChart, dorling;

  $(function() {
    var keys, lastKey, map_cont, mode, partyCols, selected, thumb_cont, year, years, _cs, _key, _sg;
    map_cont = $('#map');
    thumb_cont = $('#map-thumbs');
    years = ['98', '03', '08', '13'];
    year = '08';
    selected = '';
    mode = 'choropleth';
    _cs = null;
    _key = null;
    _sg = null;
    lastKey = null;
    keys = ['CDU', 'SPD', 'FDP', 'GRÜNE', 'LINKE'];
    partyCols = {
      CDU: 'Greys',
      SPD: 'Reds',
      'GRÜNE': 'Greens',
      FDP: 'YlOrBr',
      LINKE: 'PuRd'
    };
    return $.getJSON('/assets/data/all.json', function(data) {
      return $.get('/assets/svg/wk17-alt.svg', function(svg) {
        return $.get('/assets/svg/wk17-small-alt.svg', function(svg2) {
          var elsel, getColorScale, getVote, initMaps, initUI, main, updateMaps, wkFill;
          main = $K.map(map_cont);
          $.each(data, function(id, wk) {
            return wk.id = id;
          });
          getVote = function(wk, key) {
            if ((wk.v2[key] != null) && (wk.v2[key][year] != null)) {
              return wk.v2[key][year] / wk.v2.votes[year];
            } else {
              return null;
            }
          };
          getColorScale = function() {
            var b, base, key, values, _ref;
            key = _key;
            values = [0.01];
            $.each(data, function(id, wk) {
              var v;
              v = getVote(wk, key);
              if (v != null) {
                return values.push(v);
              }
            });
            base = chroma.hex((_ref = Common.partyColors[key]) != null ? _ref : '#00d');
            b = base.hcl();
            return new chroma.ColorScale({
              colors: chroma.brewer[partyCols[key]],
              limits: chroma.limits(values, 'e', 10)
            });
          };
          wkFill = function(d) {
            var val, wk;
            wk = data[d.id];
            if (wk != null) {
              val = getVote(wk, _key);
              if (val != null) {
                return _cs.getColor(val);
              } else {
                return '#ccc';
              }
            } else {
              return '#f0f';
            }
          };
          updateMaps = function(key) {
            _key = lastKey = key;
            _cs = getColorScale();
            $('h1.key').html(key);
            $('span.yr').html((year < 80 ? '20' : '19') + year);
            if (_sg) {
              _sg.remove();
              _sg = null;
            }
            if (mode === 'choropleth') {
              main.getLayer('wahlkreise').style('fill', wkFill).style('stroke', '#fff');
              main.getLayer('fg').tooltips(function(d) {
                return '<b>' + d.name + '</b><br />' + barChart(data[d.id].v2, year);
              });
            } else {
              main.getLayer('wahlkreise').style('fill', '#eee').style('stroke', '#bbb8b2');
              main.getLayer('fg').tooltips(function(d) {
                return 'no';
              });
              _sg = main.addSymbols({
                data: data,
                filter: function(d) {
                  return d.id !== '00';
                },
                type: $K.Bubble,
                attrs: function(d) {
                  return {
                    fill: wkFill(d),
                    'fill-opacity': 0.9,
                    'stroke-width': 0.5
                  };
                },
                location: function(d) {
                  return 'wahlkreise.' + d.id;
                },
                radius: function(d) {
                  return Math.sqrt(data[d.id].v2.voters[year] / 100000) * 20;
                },
                tooltip: function(d) {
                  console.log(d);
                  return '<b>' + d.n + '</b><br />' + barChart(data[d.id].v2, year);
                }
              });
              dorling(_sg);
            }
            return $.each(keys, function(i, key) {
              var map;
              _key = key;
              _cs = getColorScale();
              map = $('.thumb.' + key).data('map');
              map.getLayer('wahlkreise').style('fill', wkFill).style('stroke', wkFill);
            });
          };
          initMaps = function() {
            var labels;
            main.setMap(svg, {
              padding: 10
            });
            main.addLayer('wahlkreise', {
              name: 'bg',
              styles: {
                stroke: '#000',
                fill: '#ddd',
                'stroke-linejoin': 'round',
                'stroke-width': 4
              }
            });
            main.addLayer('wahlkreise', {
              key: 'id',
              styles: {
                stroke: '#fff'
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
            window.map = main;
            $.each(keys, function(i, key) {
              var map, mclick, t;
              t = $('<div class="thumb" />').appendTo(thumb_cont);
              map = $K.map(t, 190, 170);
              t.addClass(key);
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
                return updateMaps(this.key);
              };
              map.addLayer('wahlkreise', {
                click: mclick.bind({
                  key: key
                }),
                styles: {
                  cursor: 'pointer'
                }
              });
              t.append('<label>' + key + '</label>');
              t.css('opacity', 0);
              setTimeout(function() {
                return t.animate({
                  opacity: 1
                });
              }, Math.sqrt(i + 1) * 200);
              return true;
            });
          };
          initUI = function() {
            return $('.map-type .btn').click(function(evt) {
              var btn;
              btn = $(evt.target);
              $('.map-type .btn').removeClass('btn-primary');
              btn.addClass('btn-primary');
              mode = btn.data('type');
              return updateMaps(lastKey);
            });
          };
          initUI();
          initMaps();
          updateMaps('CDU');
          return elsel = Common.ElectionSelector(years, 2, function(active) {
            console.log(active);
            if (active < 3) {
              year = years[active];
              updateMaps(lastKey);
              return true;
            }
            return false;
          });
        });
      });
    });
  });

  dorling = function(symbolgroup) {
    var A, B, apply, d, ds, dx, dy, f, i, j, nodes, r, rd, rs, _i;
    nodes = [];
    $.each(symbolgroup.symbols, function(i, s) {
      return nodes.push({
        i: i,
        x: s.path.attrs.cx,
        y: s.path.attrs.cy,
        r: s.path.attrs.r
      });
    });
    nodes.sort(function(a, b) {
      return b.r - a.r;
    });
    apply = function() {
      var n, _i, _len;
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        symbolgroup.symbols[n.i].path.attr({
          cx: n.x,
          cy: n.y
        });
      }
    };
    for (r = _i = 1; _i <= 40; r = ++_i) {
      for (i in nodes) {
        for (j in nodes) {
          if (j > i) {
            A = nodes[i];
            B = nodes[j];
            if (A.x + A.r < B.x - B.r || A.x - A.r > B.x + B.r) {
              continue;
            }
            if (A.y + A.r < B.y - B.r || A.y - A.r > B.y + B.r) {
              continue;
            }
            dx = A.x - B.x;
            dy = A.y - B.y;
            ds = dx * dx + dy * dy;
            rd = A.r + B.r;
            rs = rd * rd;
            if (ds < rs) {
              d = Math.sqrt(ds);
              f = 10 / d;
              A.x += dx * f * (1 - (A.r / rd));
              A.y += dy * f * (1 - (A.r / rd));
              B.x -= dx * f * (1 - (B.r / rd));
              B.y -= dy * f * (1 - (B.r / rd));
            }
          }
        }
      }
    }
    return apply();
  };

  barChart = function(v2, yr) {
    var bch, bh, key, keys, max, tt, v, _i, _j, _len, _len1;
    tt = '';
    bch = 80;
    max = 0;
    keys = ['CDU', 'SPD', 'FDP', 'GRÜNE', 'LINKE'];
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      max = Math.max(v2[key][yr], max);
    }
    keys.sort(function(a, b) {
      return v2[b][yr] - v2[a][yr];
    });
    tt += '<div class="barchart" style="height:' + bch + 'px">';
    for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
      key = keys[_j];
      v = (v2[key][yr] / v2.votes[yr] * 100).toFixed(1) + '%';
      bh = (v2[key][yr] / max) * bch;
      tt += '<div class="col" style="margin-top:' + (bch - bh) + 'px">';
      tt += '<div class="bar ' + key.replace('Ü', 'UE') + '" style="height:' + bh + 'px">';
      tt += '<div class="lbl' + (bh < 20 ? ' top' : '') + '">' + v + '</div></div>';
      tt += '<div class="lbl">' + key + '</div>';
      tt += '</div>';
    }
    tt += '</div>';
    return tt;
  };

}).call(this);
