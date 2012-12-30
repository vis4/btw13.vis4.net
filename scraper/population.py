# encoding: utf-8
# scraper für bevölkerungsstatistiken
# schreibt JSON
#

from bs4 import BeautifulSoup

soup = BeautifulSoup(open('../data/population.html').read())

rows = soup.find_all('tr')
wknr = name = None
store = {}

for row in rows:
    cols = row.find_all('td')
    if len(cols) == 1:
        t = cols[0].text.strip()
        if t:
            if t == 'Niedersachsen':
                name = t
                wknr = '00'
            else:
                wknr = t[0:8].strip()
                name = t[8:].strip()
            if wknr not in store:
                store[wknr] = dict(name=name, raw={})
            else:
                print 'duplicate wknr'
    elif len(cols) == 8:
        key = cols[0].text.strip()
        store[wknr]['raw'][key] = int(cols[1].text)

for wknr in store:
    store[wknr]['total'] = store[wknr]['raw']['Insgesamt']
    store[wknr]['working-age'] = store[wknr]['raw']['15 - 60'] + store[wknr]['raw']['60 - 65']
    del store[wknr]['raw']

import json
open('../data/population.json', 'wb').write(json.dumps(store))
