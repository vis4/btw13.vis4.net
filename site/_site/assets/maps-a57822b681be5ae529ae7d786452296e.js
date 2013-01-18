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

/*! Smooth Scroll - v1.4.7 - 2012-10-29
* Copyright (c) 2012 Karl Swedberg; Licensed MIT, GPL */
(function(a){function f(a){return a.replace(/(:|\.)/g,"\\$1")}var b="1.4.7",c={exclude:[],excludeWithin:[],offset:0,direction:"top",scrollElement:null,scrollTarget:null,beforeScroll:function(){},afterScroll:function(){},easing:"swing",speed:400,autoCoefficent:2},d=function(b){var c=[],d=!1,e=b.dir&&b.dir=="left"?"scrollLeft":"scrollTop";return this.each(function(){if(this==document||this==window)return;var b=a(this);b[e]()>0?c.push(this):(b[e](1),d=b[e]()>0,d&&c.push(this),b[e](0))}),c.length||this.each(function(a){this.nodeName==="BODY"&&(c=[this])}),b.el==="first"&&c.length>1&&(c=[c[0]]),c},e="ontouchend"in document;a.fn.extend({scrollable:function(a){var b=d.call(this,{dir:a});return this.pushStack(b)},firstScrollable:function(a){var b=d.call(this,{el:"first",dir:a});return this.pushStack(b)},smoothScroll:function(b){b=b||{};var c=a.extend({},a.fn.smoothScroll.defaults,b),d=a.smoothScroll.filterPath(location.pathname);return this.unbind("click.smoothscroll").bind("click.smoothscroll",function(b){var e=this,g=a(this),h=c.exclude,i=c.excludeWithin,j=0,k=0,l=!0,m={},n=location.hostname===e.hostname||!e.hostname,o=c.scrollTarget||(a.smoothScroll.filterPath(e.pathname)||d)===d,p=f(e.hash);if(!c.scrollTarget&&(!n||!o||!p))l=!1;else{while(l&&j<h.length)g.is(f(h[j++]))&&(l=!1);while(l&&k<i.length)g.closest(i[k++]).length&&(l=!1)}l&&(b.preventDefault(),a.extend(m,c,{scrollTarget:c.scrollTarget||p,link:e}),a.smoothScroll(m))}),this}}),a.smoothScroll=function(b,c){var d,e,f,g,h=0,i="offset",j="scrollTop",k={},l={},m=[];typeof b=="number"?(d=a.fn.smoothScroll.defaults,f=b):(d=a.extend({},a.fn.smoothScroll.defaults,b||{}),d.scrollElement&&(i="position",d.scrollElement.css("position")=="static"&&d.scrollElement.css("position","relative"))),d=a.extend({link:null},d),j=d.direction=="left"?"scrollLeft":j,d.scrollElement?(e=d.scrollElement,h=e[j]()):e=a("html, body").firstScrollable(),d.beforeScroll.call(e,d),f=typeof b=="number"?b:c||a(d.scrollTarget)[i]()&&a(d.scrollTarget)[i]()[d.direction]||0,k[j]=f+h+d.offset,g=d.speed,g==="auto"&&(g=k[j]||e.scrollTop(),g=g/d.autoCoefficent),l={duration:g,easing:d.easing,complete:function(){d.afterScroll.call(d.link,d)}},d.step&&(l.step=d.step),e.length?e.stop().animate(k,l):d.afterScroll.call(d.link,d)},a.smoothScroll.version=b,a.smoothScroll.filterPath=function(a){return a.replace(/^\//,"").replace(/(index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")},a.fn.smoothScroll.defaults=c})(jQuery);
(function() {

  $(function() {
    var defCol, defLimits, keys, lastKey, map_cont, mode, partyCols, partyLimits, selected, thumb_cont, year, years, _cs, _key, _sg;
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
      CDU: 'Blues',
      SPD: 'Reds',
      'GRÜNE': 'Greens',
      FDP: 'YlOrBr',
      LINKE: 'PuRd',
      PIRATEN: 'OrRd',
      NPD: 'Grays',
      REP: 'Grays',
      Schill: 'Grays'
    };
    defCol = 'YlGnBu';
    partyLimits = {
      CDU: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
      SPD: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
      FDP: [0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16],
      'GRÜNE': [0, 0.025, 0.05, 0.08, 0.11, 0.15, 0.18, 0.21],
      'LINKE': [0, 0.005, 0.01, 0.03, 0.05, 0.07, 0.09, 0.11]
    };
    defLimits = [0, 0.0025, 0.005, 0.01, 0.015, 0.03, 0.05, 0.1];
    return $.getJSON('/assets/data/all.json', function(data) {
      return $.get('/assets/svg/wk17-alt.svg', function(svg) {
        return $.get('/assets/svg/wk17-small-alt.svg', function(svg2) {
          var barChart, elsel, getColorScale, getVote, initMaps, initUI, main, updateLegend, updateMaps, updateOtherPartySelect, wkFill;
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
            var b, base, key, values, _ref, _ref1, _ref2;
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
              colors: chroma.brewer[(_ref1 = partyCols[key]) != null ? _ref1 : defCol],
              limits: (_ref2 = partyLimits[key]) != null ? _ref2 : defLimits
            });
          };
          wkFill = function(d) {
            var val, wk;
            wk = data[d.id];
            if (wk != null) {
              val = getVote(wk, _key);
              if (val === 0) {
                return '#fff';
              } else if (val != null) {
                return _cs.getColor(val).hex();
              } else {
                return '#ccc';
              }
            } else {
              return '#f0f';
            }
          };
          updateLegend = function() {
            var col, d, l, lgd, limits, _i, _len, _ref, _ref1, _results;
            limits = (_ref = partyLimits[lastKey]) != null ? _ref : defLimits;
            lgd = $('.col-legend').html('');
            _ref1 = limits.slice(1, -1);
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              l = _ref1[_i];
              col = _cs.getColor(l + 0.001);
              l *= 100;
              l = l >= 3 || l === 1 || l === 2 ? Math.round(l) : l.toFixed(1);
              d = $('<div>&gt;' + l + '%</div>');
              d.data('color', col.hex());
              d.css({
                background: col
              });
              if (col.hcl()[2] < 0.5) {
                d.css('color', '#fff');
              }
              lgd.append(d);
              _results.push(d.on('click', function(evt) {
                var path, _j, _len1, _ref2, _results1;
                d = $(evt.target);
                col = d.data('color');
                _ref2 = main.getLayer('wahlkreise').paths;
                _results1 = [];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  path = _ref2[_j];
                  if (path.svgPath.attrs.fill === col) {
                    path.svgPath.attr('fill', '#ffd');
                    _results1.push(path.svgPath.animate({
                      fill: col
                    }, 700));
                  } else {
                    _results1.push(void 0);
                  }
                }
                return _results1;
              }));
            }
            return _results;
          };
          updateOtherPartySelect = function() {
            var key, others, sel, _i, _len;
            sel = $('#other-parties');
            sel.html('');
            others = [];
            for (key in data['00'].v2) {
              if (key !== 'votes' && key !== 'voters' && key !== 'turnout' && key !== 'others' && data['00'].v2[key][year] > 0) {
                others.push(key);
              }
            }
            others.sort(function(a, b) {
              return data['00'].v2[b][year] - data['00'].v2[a][year];
            });
            for (_i = 0, _len = others.length; _i < _len; _i++) {
              key = others[_i];
              sel.append('<option ' + (key === lastKey ? 'selected="selected"' : void 0) + '>' + key + '</option>');
            }
          };
          barChart = function(v2, yr) {
            var bch, bh, key, max, tt, v, _i, _j, _len, _len1;
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
            if ($.inArray(lastKey, keys) < 0) {
              tt += '<div class="tt-other"><b>' + lastKey + ':</b> ' + (v2[lastKey][yr] / v2.votes[yr] * 100).toFixed(1) + '% (' + v2[lastKey][yr] + ')</div>';
            }
            return tt;
          };
          updateMaps = function(key) {
            _key = lastKey = key;
            _cs = getColorScale();
            $('.key').html(key);
            $('span.yr').html((year < 80 ? '20' : '19') + year);
            updateLegend();
            updateOtherPartySelect();
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
              Kartograph.dorlingLayout(_sg);
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
                stroke: '#fff',
                'stroke-linejoin': 'round'
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
                updateMaps(this.key);
                return setTimeout(function() {
                  return $.smoothScroll({
                    scrollTarget: 'h1.key',
                    offset: -20
                  });
                }, 200);
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
            $('.map-type .btn').click(function(evt) {
              var btn;
              btn = $(evt.target);
              $('.map-type .btn').removeClass('btn-primary');
              btn.addClass('btn-primary');
              mode = btn.data('type');
              return updateMaps(lastKey);
            });
            return $('#other-parties').change(function() {
              return updateMaps($('#other-parties').val());
            });
          };
          initUI();
          initMaps();
          updateMaps('CDU');
          return elsel = Common.ElectionSelector(years, 2, function(active) {
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

}).call(this);
