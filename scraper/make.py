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
#votes = [getjson('../data/votes-1.json'), getjson('../data/votes-2.json')]
votes = getjson('../data/votes-new.json')
tax = getjson('../data/tax.json')

out = {}

for wknr in population:
    out[wknr] = dict(
        n=population[wknr]['name'],
        p=population[wknr]['total'],
        e=round(float(workers[wknr]['workers']) / population[wknr]['working-age'], 3),
        t=round(tax[wknr]['tax'] * 1000 / workers[wknr]['workers']),
        v1=votes[wknr]['v1'],
        v2=votes[wknr]['v2']
    )

open('../site/assets/data/all.json', 'w').write(json.dumps(out))
