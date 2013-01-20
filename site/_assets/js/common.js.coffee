# shared javascript objects

Common = window.Common ?= {}

Common.classes =
    CDU: 'CDU'
    SPD: 'SPD'
    FDP: 'FDP'
    LPDS: 'LIN'
    GRÜNE: 'GRU'
    PIRATEN: 'PIR'

Common.partyColors =
    CDU: '#222222'
    SPD: '#E2001A'
    GRÜNE: '#1FA12D'
    FDP: '#F3E241'
    LINKE: '#8B1C62'

Common.humanNames =
    '01-03': 'Braunschweig<sup>1</sup>'
    '24-28': 'Hannover<sup>2</sup>'

Common.ElectionSelector = (data, active, callback, yr) ->
    elsel = $('<div class="election-selector" />').appendTo '#container'
    currentActive = active
    blocked = false
    update = (a, evt) ->
        if blocked
            return
        blocked = true
        setTimeout () ->
            blocked = false
        , 1000
        r = callback a, evt
        if r
            currentActive = a
            $('a', elsel).removeClass 'active'
            $('a.i-'+currentActive, elsel).addClass 'active'
    $.each data, (i, item) ->
        y = if yr? then yr item else item
        a = $ '<a><span class="long">'+(if y < 80 then '20' else '19')+'</span>'+y+'</a>'
        a.addClass 'i-' + i
        a.css
            'margin-right': 10
            cursor: 'pointer'
        a.data 'index', i
        a.click (evt) ->
            active = $(evt.target).data('index')
            currentActive = active
            update active, evt
            null
        if i == active
            a.addClass 'active'
        elsel.append a
    turnleft = (evt) ->
        if currentActive > 0
            active = currentActive - 1
            update active, evt
    turnright = (evt) ->
        active = currentActive + 1
        if $('a.i-'+active).length > 0
            update active, evt
    $(window).on 'keydown', (evt) ->
        if evt.keyCode == 37
            turnleft()
        else if evt.keyCode == 39
            turnright()
    $('body').swipeEvents()
    .bind('swipeRight', turnleft)
    .bind('swipeLeft', turnright)
    elsel

Common.CityLabels = [
    name: 'Bremen',
    lon: 8.84,
    lat: 53.11
,
    name: 'Hamburg',
    lon: 10.2,
    lat: 53.57
,
    name: 'H',
    lon: 9.76,
    lat: 52.38
,
    name: 'OS',
    lon: 8.03,
    lat: 52.28
,
    name: 'OL',
    lon: 8.2,
    lat: 53.15
,
    name: 'BS',
    lon: 10.53,
    lat: 52.26
,
    name: 'GÖ',
    lon: 9.94,
    lat: 51.53
,
    name: 'WHV',
    lon: 8.10,
    lat: 53.6
]