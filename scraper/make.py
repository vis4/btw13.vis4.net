# combine all scraped data into one JSON

import json


def getjson(fn):
    f = open(fn, 'r')
    r = json.loads(f.read())
    f.close()
    return r

foreigners = getjson('../data/foreigners.json')
workers = getjson('../data/workers.json')
population = getjson('../data/population.json')
votes = [getjson('../data/votes-1.json'), getjson('../data/votes-2.json')]
tax = getjson('../data/tax.json')

out = {}

for wknr in population:
    out[wknr] = dict(
        n=population[wknr]['name'],
        p=population[wknr]['total'],
        e=round(float(workers[wknr]['workers']) / population[wknr]['working-age'], 3),
        t=round(tax[wknr]['tax'] * 1000 / workers[wknr]['workers']),
        v1=dict(),
        v2=dict()
    )
    try:
        out[wknr]['f'] = round(float(foreigners[wknr]['foreigners']) / population[wknr]['total'], 3)
    except:
        pass
    for i in range(len(votes)):
        wkv = out[wknr]['v%d' % (i + 1)]
        for yr in ('98', '03', '08'):
            v = votes[i][wknr][yr]
            for p in v:
                if v[p] < v['total'] * 0.01:
                    continue
                if p not in wkv:
                    wkv[p] = {}
                wkv[p][yr] = v[p]

open('../site/assets/data/all.json', 'w').write(json.dumps(out))
