# coalition stacked bar chart

$ () ->

    _coalitions = ["CDU,SPD", "CDU,FDP", "CDU,FDP,PIRATEN", "CDU,GRÜNE", "SPD,GRÜNE", "SPD,FDP",
        "SPD,LINKE", "CDU,FDP,GRÜNE", "SPD,FDP,GRÜNE", "SPD,LINKE,GRÜNE"]
    _cont = $ '#canvas'
    _lblcont = $ '.vis-coalitions'
    canvas = Raphael _cont.get 0
    bar_w = 30
    elections = null
    width = _cont.width()
    height = _cont.height()-12
    stacked_bars = {}
    current_poll = null
    grid = {}
    bg = null
    partyColors = Common.partyColors
    winner =
        #'13': 'SPD,GRÜNE'
        '08': 'CDU,FDP'
        '03': 'CDU,FDP'
        '98': 'SPD'
        '94': 'SPD'
        '90': 'SPD,GRÜNE'

    $.fn.set = (txt) ->
        $('span', this).html txt

    get_coalitions = (poll, justParties) ->
        seats = poll.seats
        coalitions = []
        sum_seats = _.reduce seats, (s, v) ->
            s + v
        , 0

        min_seats = Math.ceil((sum_seats + 0.5) * 0.5)

        _.each _coalitions, (parties, i) ->
            coalition =
                id: i
                key: parties
                parties: []
                seats: 0

            _.each parties.split(','), (party) ->
                if not coalition
                    return
                if seats[party] # if party has results
                    coalition.parties.push  # add it to coalition
                        name: party
                        seats: seats[party]
                    # and add their seats to the coalition seats
                    coalition.seats += seats[party]
                else
                    coalition = null
                    return false

            if coalition?
                # sort parties in coalition by seats
                coalition.parties.sort (a,b) ->
                    b.seats - a.seats
                coalitions.push coalition

        # filter coalitions that make no sense
        coalitions = coalitions.filter (coalition) ->
            if coalition.parties.length == 3
                makessense = true
                _.each coalitions, (c) ->
                    if c.parties.length == 2
                        if c.parties[0].name == coalition.parties[0].name
                            if c.parties[1].name == coalition.parties[1].name or c.parties[1].name == coalition.parties[2].name
                                if c.seats >= poll.min_seats
                                    makessense = false
                                    return false
                makessense
            else
                true

        # add individual parties for comparison
        _.each seats, (s, party) ->
            if s > min_seats * 0.5 or (justParties and s > 0)
                coalitions.push
                    key: party
                    seats: s
                    parties: [{ name: party, seats: s }]

        # sort coalitions by majority
        coalitions.sort (a,b) ->
            if a.seats >= min_seats && b.seats >= min_seats
                # sort by biggest party first, bc they have the
                # privilege to set a government
                if a.parties[0].seats != b.parties[0].seats
                    return b.parties[0].seats - a.parties[0].seats
            b.seats - a.seats;
        # return coalitions
        poll.min_seats = min_seats
        coalitions

    render = (poll, justParties=false, firstLoad=false) ->
        coalitions = get_coalitions poll, justParties

        bar_w = if justParties then 60 else 30

        yscale = (seats) ->
            # scale according to biggest coalition seats
            Math.round seats / coalitions[0].seats * height

        label = (clss, txt) ->
            lbl = $ '<div class="label '+clss+'"><span /></div>'
            _lblcont.append lbl
            lbl.css
                opacity: 0
            if txt?
                lbl.set txt
            lbl

        $('.desc').hide()
        setTimeout () ->
            $('.desc').fadeIn 1000
        , 2000

        $('.label.top').animate
            opacity: 0

        bar_w = Math.round((width - 220) / coalitions.length / 1.8)
        offset = width - coalitions.length * bar_w * 1.8 - 15

        if justParties
            bar_w = (width - 340) / coalitions.length / 1.8

        # animate bars for each coalition
        possible = true
        $.each coalitions, (i, coalition) ->
            if not stacked_bars[coalition.key]?
                # first occurance of this coalition, create bars
                sbc = stacked_bars[coalition.key] = {}
                $.each coalition.parties, (j, party) ->
                    x = 20 + i * bar_w * 1.8
                    x += 340 if justParties
                    y = 0
                    h = 0
                    bar = canvas.rect x, height - h - y, bar_w, h
                    bar.attr
                        stroke: if coalition.seats > poll.min_seats then '#fff' else '#eee'
                        opacity: 0.98
                        fill: partyColors[party.name] || ('#ccc' && console.log(party.name))
                    sbc[party.name] = bar
                sbc.toplabel = label 'bar top center'
                sbc.bottomlabel = label 'bar bottom center', coalition.key.replace(/,/g, '<br/>')

            sbc = stacked_bars[coalition.key]

            # position the stacked bars
            y = 0
            x = Math.round 20 + i * bar_w * 1.8
            if coalition.seats < poll.min_seats
                x += offset if not justParties
                if possible
                    $('.desc-impossible').css
                        right: width - x+10
                    $('.desc-possible').css
                        left: x - offset
                    possible = false

            setTimeout () ->
                sbc.bottomlabel.animate
                    left: x-40+bar_w*0.5
                sbc.toplabel.animate
                    left: x-40+bar_w*0.5
            , 1000
            # make labels visible again, in case they're hidden
            setTimeout () ->
                sbc.bottomlabel.animate
                    opacity: 1
                sbc.toplabel.animate
                    opacity: 1
            , 1000
            $.each coalition.parties, (j, party) ->
                bar = sbc[party.name]
                # animate bar heights and y position first
                h = yscale party.seats
                barprops =
                    y: height - h - y - 0.5
                    height: h
                    width: bar_w
                bar.animate barprops, 1000, 'expoInOut', () ->
                    props = # animate stacks x position last
                    bar.animate
                        x: x + 0.5
                    , 1000, 'expoInOut'
                    # make bar visible again, it case it was hidden
                    setTimeout ()->
                        bar.animate
                            opacity: 1
                        , 300
                    , 1000
                y += h
            sbc.toplabel.animate
                top: height - y - 22


            tl = coalition.seats - poll.min_seats
            if tl < 0
                sbc.toplabel.addClass 'negative'
            else
                sbc.toplabel.removeClass 'negative'
            tl = '+' + tl if tl > 0
            tl = '±' + tl if tl == 0
            sbc.toplabel.set tl

            $('.label.bottom').removeClass 'winner'

            # setTimeout () ->
            #     if not justParties
            #         if winner[election.yr] and stacked_bars[winner[election.yr]]
            #             stacked_bars[winner[election.yr]].bottomlabel.addClass 'winner'
            # , 2200


        # hide previous coalitions
        $.each stacked_bars, (key, bars) ->
            found = false
            $.each coalitions, (i, coalition) ->
                if coalition.key == key
                    found = true
                    false
                true
            if not found
                $.each bars, (party, bar) ->
                    bar.animate
                        opacity: 0
                    , 300

        # update grid lines
        init_grid_line = (addlbl=true) ->
            line = canvas.path 'M0,'+(height-.5)+' L'+width+','+(height-0.5)
            line.toBack()
            if addlbl
                lbl = label 'grid left'
                line.data 'lbl', lbl
                lbl = label 'grid right'
                line.data 'lbl2', lbl
            line

        move_grid_line = (line, seats) ->
            animprops =
                transform: 't0,'+(0 - yscale(seats))
            line.animate animprops, '800', 'expoInOut'
            if line.data('lbl')?
                lbl = line.data 'lbl'
                lbl.set seats
                lbl.animate
                    opacity: 1
                    top: height - yscale(seats) - 8
                lbl = line.data 'lbl2'
                lbl.set seats
                lbl.animate
                    opacity: 1
                    top: height - yscale(seats) - 8
            return

        if not grid.min_seats?
            grid.min_seats = init_grid_line()
            grid.min_seats.data('lbl').addClass 'min-seats'
            grid.min_seats.data('lbl2').addClass 'min-seats'
            # initialize base line
            grid.bottom = init_grid_line(false)  #.transform 't0,1'

        grid.bottom.toFront()

        move_grid_line grid.min_seats, poll.min_seats

        # init and move grid lines
        _.each [100,200,300], (seats) ->
            if not grid[seats]?
                grid[seats] = init_grid_line()
                grid[seats].attr
                    'stroke-dasharray': '- '
            move_grid_line grid[seats], seats
            lineprops =
                opacity: if seats+5 < poll.min_seats then 1 else 0
            grid[seats].animate lineprops, 500
            grid[seats].data('lbl').animate lineprops
            grid[seats].data('lbl2').animate lineprops

        # init and resize background
        if not bg?
            bg = canvas.rect 0,height-1,width,1
            bg.attr
                fill: '#f5f5f5'
                stroke: false
            bg.toBack()
        bgprops =
            y: height - yscale(poll.min_seats)
            height: yscale(poll.min_seats)
            opacity: 1

        if justParties
            $('.desc-intro').show()
            $('.desc-impossible, .desc-possible, .label.left').hide()
            bg.animate
                opacity: 0
        else
            $('.desc-intro').hide()
            $('.desc-impossible, .desc-possible, .label.left').show()
            bg.animate bgprops, 800, 'expoInOut'

    if location.hash.length and location.hash != '#activate'
        progn = location.hash.substr(1).replace(/\//, '-')
    else
        #progn = $($('.prognosen a').get(0)).attr('href').substr(1)
        progn = 'elections-nds-amtl-2342'

    $('.prognosen a[href=#'+progn+']').addClass 'active'

    prevJSON = undefined

    update = () ->

        $.ajax
            url: 'assets/data/hochrechnungen.json'
            dataType: 'json'
        .done (json) ->

            firstLoad = _.isUndefined prevJSON

            if !prevJSON || json.length != prevJSON.length
                prevJSON = polls = json

                current_poll = false

                cont = $ '.prognosen'
                cont.html('')
                # _.each _.keys(polls), (provider) ->
                #     $('<label>'+provider+'</label>').appendTo cont
                #     ul = $('<ul />').appendTo cont


                _.each polls, (poll) ->
                    li = $('<li><div class="provider">'+poll.institute+'</div><div>'+poll.time+'</div></li>')
                    if not current_poll
                        current_poll = poll
                        li.addClass 'active'
                    
                    li.data 'poll', poll
                    li.appendTo cont
                        .click (evt) ->
                            render $(evt.target).parent().data 'poll'
                            $('.prognosen li').removeClass 'active'
                            $(evt.target).parent().addClass 'active'

                pollFromHash = (hash) ->
                    [prov, time] = hash.substr(1).split '-'
                    if polls[prov]
                        _.find polls, (p) -> p.time == time

                if firstLoad
                    if location.hash
                        poll = pollFromHash location.hash
                        if poll
                            current_poll = poll

                render current_poll
                blocked = false

            setTimeout update, 10000

    update()

