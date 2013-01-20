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
    var blocked, currentActive, elsel, turnleft, turnright, update;
    elsel = $('<div class="election-selector" />').appendTo('#container');
    currentActive = active;
    blocked = false;
    update = function(a, evt) {
      var r;
      if (blocked) {
        return;
      }
      blocked = true;
      setTimeout(function() {
        return blocked = false;
      }, 1000);
      r = callback(a, evt);
      if (r) {
        currentActive = a;
        $('a', elsel).removeClass('active');
        return $('a.i-' + currentActive, elsel).addClass('active');
      }
    };
    $.each(data, function(i, item) {
      var a, y;
      y = yr != null ? yr(item) : item;
      a = $('<a><span class="long">' + (y < 80 ? '20' : '19') + '</span>' + y + (y === '13' ? '<sup>*</sup>' : '') + '</a>');
      a.addClass('i-' + i);
      a.css({
        'margin-right': 10,
        cursor: 'pointer'
      });
      a.data('index', i);
      a.click(function(evt) {
        active = $(evt.target).data('index');
        currentActive = active;
        update(active, evt);
        return null;
      });
      if (i === active) {
        a.addClass('active');
      }
      return elsel.append(a);
    });
    turnleft = function(evt) {
      if (currentActive > 0) {
        active = currentActive - 1;
        return update(active, evt);
      }
    };
    turnright = function(evt) {
      active = currentActive + 1;
      if ($('a.i-' + active).length > 0) {
        return update(active, evt);
      }
    };
    $(window).on('keydown', function(evt) {
      if (evt.keyCode === 37) {
        return turnleft();
      } else if (evt.keyCode === 39) {
        return turnright();
      }
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
(function($) { 
  $.fn.swipeEvents = function() {
    return this.each(function() {
      
      var startX,
          startY,
          $this = $(this);
      
      $this.bind('touchstart', touchstart);
      
      function touchstart(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          $this.bind('touchmove', touchmove);
        }
        event.preventDefault();
      }
      
      function touchmove(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          var deltaX = startX - touches[0].pageX;
          var deltaY = startY - touches[0].pageY;
          
          if (deltaX >= 50) {
            $this.trigger("swipeLeft");
            event.preventDefault();
          }
          if (deltaX <= -50) {
            $this.trigger("swipeRight");
            event.preventDefault();
          }
          if (deltaY >= 50) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -50) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
            $this.unbind('touchmove', touchmove);
          }
        }
      }
      
    });
  };
})(jQuery);
(function() {

  $(function() {
    var coalitions, lastCoalition, main, thumb_cont, year, years;
    thumb_cont = $('#map-thumbs');
    years = ['98', '03', '08', '13'];
    year = '13';
    main = null;
    lastCoalition = null;
    coalitions = [
      {
        id: 'cdu-fdp',
        name: 'Schwarz-Gelb',
        parties: ['CDU', 'FDP']
      }, {
        id: 'spd-gruene',
        name: 'Rot-Grün',
        parties: ['SPD', 'GRÜNE']
      }, {
        id: 'cdu-gruene',
        name: 'Schwarz-Grün',
        parties: ['CDU', 'GRÜNE']
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
    return $.getJSON('/assets/data/all-13.json', function(data) {
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
                return 'opacity:0.7;stroke:#000;fill:#000;stroke-width:5px;stroke-linejoin:round;font-size:11px;font-weight:bold';
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
                updateMaps(this.coalition);
                return setTimeout(function() {
                  return $.smoothScroll({
                    scrollTarget: 'h1.key',
                    offset: -20
                  });
                }, 200);
              };
              map.addLayer('wahlkreise', {
                click: mclick.bind({
                  coalition: coalition
                }),
                styles: {
                  cursor: 'pointer',
                  stroke: '#fff',
                  'stroke-width': 0,
                  fill: '#ddd'
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
            var cnt;
            lastCoalition = coalition;
            cnt = 0;
            main.getLayer('wahlkreise').applyTexture('/assets/img/' + coalition.id + '.png', function(d) {
              var key, keys, sum, v, _i, _len;
              keys = coalition.parties;
              sum = 0;
              for (_i = 0, _len = keys.length; _i < _len; _i++) {
                key = keys[_i];
                sum += data[d.id].v2[key][year];
              }
              v = sum / data[d.id].v2.votes[year];
              if (v >= 0.5) {
                cnt++;
              }
              return v >= 0.5;
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
            $('.num-wk').html(cnt);
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
                  return '#ddd';
                }
              });
            });
          };
          initMaps();
          updateMaps(coalitions[0]);
          return elsel = Common.ElectionSelector(years, 3, function(active) {
            console.log(active);
            if (active < 4) {
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
