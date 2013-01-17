

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


$ () ->

    $.getJSON '/assets/data/all.json', (data) ->
        $.get '/assets/svg/wk17-alt.svg', (svg) ->
            $.get '/assets/svg/wk17-small-alt.svg', (svg2) ->

                main = $K.map map_cont

                $.each data, (id, wk) ->
                    wk.id = id

                updateMaps = (key) ->
                    false

                initMaps = () ->
                    false

                initUI = () ->
                    false


                initUI()
                initMaps()
                updateMaps 'CDU'


