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
    $.each data, (i, item) ->
        y = if yr? then yr item else item
        a = $ '<a><span class="long">'+(if y < 80 then '20' else '19')+'</span>'+y+'</a>'
        a.css
            'margin-right': 10
            cursor: 'pointer'
        a.data 'index', i
        a.click (evt) ->
            active = $(evt.target).data('index')
            r = callback active, evt
            if r
                $('a', elsel).removeClass 'active'
                $(evt.target).addClass 'active'
            null
        if i == active
            a.addClass 'active'
        elsel.append a
    elsel