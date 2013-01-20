
$ () ->

    thumb_cont = $ '#map-thumbs'
    years = ['98','03','08','13']
    year = '13'
    main = null
    lastCoalition = null
    coalitions = [
        id: 'cdu-fdp'
        name: 'Schwarz-Gelb'
        parties: ['CDU', 'FDP']
    ,
        id: 'spd-gruene'
        name: 'Rot-Grün'
        parties: ['SPD', 'GRÜNE']
    ,
        id: 'cdu-gruene'
        name: 'Schwarz-Grün'
        parties: ['CDU', 'GRÜNE']
    ,
        id: 'cdu-spd'
        name: 'Große Koalition'
        parties: ['CDU', 'SPD']
    ,
        id: 'jamaika'
        name: 'Jamaika-Koalition'
        parties: ['CDU', 'FDP', 'GRÜNE']
    ,
        id: 'spd-linke'
        name: 'Rot-Rot'
        parties: ['SPD', 'LINKE']
    ,
        id: 'spd-linke-gruene'
        name: 'Rot-Rot-Grün'
        parties: ['SPD', 'LINKE', 'GRÜNE']
    ]

    $.getJSON '/assets/data/all-13.json', (data) ->
        $.get '/assets/svg/wk17-alt.svg', (svg) ->
            $.get '/assets/svg/wk17-small-alt.svg', (svg2) ->


                initMaps = () ->
                    # big map
                    main = $K.map '#map'
                    main.setMap svg
                    main.addLayer 'wahlkreise'
                        styles:
                            stroke: '#fff'
                            fill: '#ccc'

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
                            'opacity:0.7;stroke:#000;fill:#000;stroke-width:5px;stroke-linejoin:round;font-size:11px;font-weight:bold'
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

                    # small map thumbs
                    $.each coalitions.slice(0,5), (i, coalition) ->
                        t = $('<div class="thumb" />').appendTo thumb_cont
                        map = $K.map t, 190, 170
                        t.addClass coalition.id
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
                            updateMaps this.coalition
                            setTimeout () ->
                                $.smoothScroll
                                    scrollTarget: 'h1.key'
                                    offset: -20
                            ,200
                        map.addLayer 'wahlkreise'
                            click: mclick.bind
                                coalition: coalition
                            styles:
                                cursor: 'pointer'
                                stroke: '#fff'
                                'stroke-width': 0
                                fill: '#ddd'

                        t.append '<label>'+coalition.name+'</label>'
                        t.css 'opacity', 0
                        setTimeout () ->
                            t.animate
                                opacity: 1
                        , Math.sqrt(i+1)*200
                        true

                    # preload textures for coalitions
                    for coalition in coalitions
                        d = $('<div class="coal">').appendTo $('.other-coalitions')
                        d.addClass coalition.id
                        $('<div />').addClass('prev').appendTo(d).css
                            background: 'url(/assets/img/'+coalition.id+'.png)'
                        d.append '<span>'+coalition.name+'</span>'
                        dclick = () ->
                            updateMaps this.coalition
                        d.click dclick.bind
                            coalition: coalition

                    return

                updateMaps = (coalition) ->
                    lastCoalition = coalition
                    cnt = 0
                    main.getLayer('wahlkreise')
                    .applyTexture '/assets/img/'+coalition.id+'.png', (d) ->
                        keys = coalition.parties
                        sum = 0
                        for key in keys
                            sum += data[d.id].v2[key][year]
                        v = sum / data[d.id].v2.votes[year]
                        cnt++ if v >= 0.5
                        v >= 0.5
                    , '#ccc'
                    main.getLayer('fg').tooltips (d) ->
                        keys = coalition.parties
                        sum = 0
                        tt = '<b>'+d.name+'</b><br />'
                        total = data[d.id].v2.votes[year]
                        for key in keys
                            v = data[d.id].v2[key][year]
                            sum += v
                            tt += '<div class="tt-other"><b>'+key+':</b> '+(100 * v / total).toFixed(1)+'%</div>'
                        tt += '<div class="tt-other"><b>Gesamt:</b> '+(100 * sum / total) .toFixed(1)+'%</div>'
                        tt

                    $('.parties').html coalition.parties.slice(0,-1).join(', ')+' und '+coalition.parties.slice(-1)[0]
                    $('.coal').removeClass 'active'
                    $('.coal.'+coalition.id).addClass 'active'
                    $('h1.key').html coalition.parties.join('+')
                    $('.num-wk').html cnt

                    $.each coalitions.slice(0,5), (i, coalition) ->
                        t = $('.thumb.'+coalition.id)
                        map = t.data 'map'
                        map.getLayer('wahlkreise').style 'fill', (d) ->
                            keys = coalition.parties
                            sum = 0
                            for key in keys
                                sum += data[d.id].v2[key][year]
                            if sum / data[d.id].v2.votes[year] >= 0.5
                                '#999'
                            else
                                '#ddd'

                initMaps()
                updateMaps coalitions[0]

                elsel = Common.ElectionSelector years, 3
                , (active) ->  # click callback
                    console.log active
                    if active < 4  # ignore 2013
                        year = years[active]
                        updateMaps lastCoalition
                        return true
                    return false