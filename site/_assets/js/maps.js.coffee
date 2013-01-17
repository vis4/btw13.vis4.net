


$ () ->

    map_cont = $ '#map'
    thumb_cont = $ '#map-thumbs'
    years = ['98','03','08','13']
    year = '08'
    selected = ''
    mode = 'choropleth'
    _cs = null  # global color scale
    _key = null  # key
    _sg = null  # symbol group
    lastKey = null
    keys = ['CDU','SPD','FDP','GRÜNE', 'LINKE']

    partyCols =
        CDU: 'Greys'
        SPD: 'Reds'
        'GRÜNE': 'Greens'
        FDP: 'YlOrBr'
        LINKE: 'PuRd'

    $.getJSON '/assets/data/all.json', (data) ->
        $.get '/assets/svg/wk17-alt.svg', (svg) ->
            $.get '/assets/svg/wk17-small-alt.svg', (svg2) ->

                main = $K.map map_cont

                $.each data, (id, wk) ->
                    wk.id = id

                getVote = (wk, key) ->
                    if wk.v2[key]? and wk.v2[key][year]?
                        wk.v2[key][year] / wk.v2.votes[year]
                    else
                        null

                getColorScale = () ->
                    key = _key
                    values = [0.01]
                    $.each data, (id, wk) ->
                        v = getVote wk, key
                        values.push v if v?
                    base = chroma.hex(Common.partyColors[key] ? '#00d')
                    b = base.hcl()
                    new chroma.ColorScale
                        colors: chroma.brewer[partyCols[key]]
                        limits: chroma.limits(values, 'e', 10)

                wkFill = (d) ->
                    wk = data[d.id] # data[if d.id < 10 then '0'+d.id else d.id]
                    if wk?
                        val = getVote wk, _key
                        if val?
                            _cs.getColor val
                        else
                            '#ccc'
                    else
                        '#f0f'

                updateMaps = (key) ->
                    _key = lastKey = key
                    _cs = getColorScale()
                    $('h1.key').html key
                    $('span.yr').html (if year < 80 then '20' else '19') + year
                    if _sg
                        _sg.remove()
                        _sg = null
                    if mode == 'choropleth'
                        main.getLayer('wahlkreise')
                        .style('fill', wkFill)
                        .style('stroke', '#fff')
                        main.getLayer('fg')
                        .tooltips (d) ->
                            '<b>'+d.name + '</b><br />' + barChart(data[d.id].v2, year)
                    else
                        main.getLayer('wahlkreise')
                        .style('fill', '#eee')
                        .style('stroke', '#bbb8b2')
                        main.getLayer('fg').tooltips (d) ->
                            'no'
                        _sg = main.addSymbols
                            data: data
                            filter: (d) ->
                                d.id != '00'
                            type: $K.Bubble
                            attrs: (d) ->
                                fill: wkFill d
                                'fill-opacity': 0.9
                                'stroke-width': 0.5
                            location: (d) ->
                                'wahlkreise.'+d.id
                            radius: (d) ->
                                Math.sqrt(data[d.id].v2.voters[year] / 100000) * 20
                            tooltip: (d) ->
                                console.log d
                                '<b>'+d.n+'</b><br />' + barChart(data[d.id].v2, year)

                        dorling _sg

                    $.each keys, (i, key) ->
                        _key = key
                        _cs = getColorScale()
                        map = $('.thumb.'+key).data 'map'
                        map.getLayer('wahlkreise')
                        .style('fill', wkFill)
                        .style('stroke', wkFill)
                        return

                initMaps = () ->
                    main.setMap svg,
                        padding: 10
                    main.addLayer 'wahlkreise'
                        name: 'bg'
                        styles:
                            stroke: '#000'
                            fill: '#ddd'
                            'stroke-linejoin': 'round'
                            'stroke-width': 4
                    main.addLayer 'wahlkreise'
                        key: 'id'
                        styles:
                            stroke: '#fff'
                        # tooltips: (d) ->
                        #     d.name + ' ' + d.id

                    labels = (style) ->
                        main.addSymbols
                            type: $K.Label
                            data: Common.CityLabels
                            location: (d) ->
                                [d.lon, d.lat]
                            text: (d) ->
                                d.name
                            style: style

                    labels (d) ->
                        if d.name.length <= 3
                            'opacity:0.6;stroke:#000;fill:#000;stroke-width:3px;stroke-linejoin:round;font-size:11px;font-weight:bold'
                        else
                            'opacity:0.6;stroke:#fff;fill:#fff;stroke-width:3px;stroke-linejoin:round;font-size:11px;'
                    labels (d) ->
                        if d.name.length <= 3
                            'fill:#fff;font-size:11px;font-weight:bold'
                        else
                            'fill:#555;font-size:11px;'


                    main.addLayer 'wahlkreise'
                        name: 'fg'
                        styles:
                            fill: '#fff'
                            opacity: 0

                    window.map = main
                    $.each keys, (i, key) ->
                        t = $('<div class="thumb" />').appendTo thumb_cont
                        map = $K.map t, 190, 170
                        t.addClass key
                        t.data 'map', map
                        map.setMap svg2,
                            padding: 5
                        map.addLayer 'wahlkreise'
                            name: 'bg'
                            styles:
                                fill: '#999'
                                stroke: '#999'
                                'stroke-width': 3
                        mclick = () ->
                            updateMaps this.key
                        map.addLayer 'wahlkreise'
                            click: mclick.bind
                                key: key
                            styles:
                                cursor: 'pointer'

                        t.append '<label>'+key+'</label>'
                        t.css 'opacity', 0
                        setTimeout () ->
                            t.animate
                                opacity: 1
                        , Math.sqrt(i+1)*200
                        true

                    return

                initUI = () ->
                    $('.map-type .btn').click (evt) ->
                        btn = $ evt.target
                        $('.map-type .btn').removeClass 'btn-primary'
                        btn.addClass 'btn-primary'
                        mode = btn.data 'type'
                        updateMaps lastKey


                initUI()
                initMaps()
                updateMaps 'CDU'


                elsel = Common.ElectionSelector years, 2
                , (active) ->  # click callback
                    console.log active
                    if active < 3  # ignore 2013
                        year = years[active]
                        updateMaps lastKey
                        return true
                    return false



dorling = (symbolgroup) ->
    nodes = []
    $.each symbolgroup.symbols, (i, s) ->
        nodes.push
            i: i
            x: s.path.attrs.cx
            y: s.path.attrs.cy
            r: s.path.attrs.r
    nodes.sort (a,b) ->
        b.r - a.r

    apply = () ->
        for n in nodes
            symbolgroup.symbols[n.i].path.attr
                cx: n.x
                cy: n.y
        return

    for r in [1..40]  # run 10 times
        for i of nodes
            for j of nodes
                if j > i
                    A = nodes[i]
                    B = nodes[j]
                    if A.x + A.r < B.x - B.r or A.x - A.r > B.x + B.r
                        continue
                    if A.y + A.r < B.y - B.r or A.y - A.r > B.y + B.r
                        continue
                    dx = (A.x - B.x)
                    dy = (A.y - B.y)
                    ds = dx * dx + dy * dy
                    rd = A.r + B.r
                    rs = rd * rd
                    if ds < rs
                        d = Math.sqrt ds
                        f = 10 / d
                        A.x += dx * f * (1-(A.r / rd))
                        A.y += dy * f * (1-(A.r / rd))
                        B.x -= dx * f * (1-(B.r / rd))
                        B.y -= dy * f * (1-(B.r / rd))
                        # overlap! move away from each other
    apply()



barChart = (v2, yr) ->
    tt = ''
    bch = 80
    max = 0
    keys = ['CDU','SPD','FDP','GRÜNE','LINKE']
    for key in keys
        max = Math.max v2[key][yr], max
    keys.sort (a,b) ->
        v2[b][yr] - v2[a][yr]
    tt += '<div class="barchart" style="height:'+bch+'px">'
    for key in keys
        v = (v2[key][yr] / v2.votes[yr] * 100).toFixed(1)+'%'
        bh = (v2[key][yr] / max) * bch
        tt += '<div class="col" style="margin-top:'+(bch-bh)+'px">'
        tt += '<div class="bar '+key.replace('Ü','UE')+'" style="height:'+bh+'px">'
        tt += '<div class="lbl'+(if bh < 20 then ' top' else '')+'">'+v+'</div></div>'
        tt += '<div class="lbl">'+key+'</div>'
        tt += '</div>'
    tt += '</div>'
    tt
