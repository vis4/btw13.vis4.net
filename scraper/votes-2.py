# encoding: utf-8
# scraper für bevölkerungsstatistiken
# schreibt JSON
#

from bs4 import BeautifulSoup

soup = BeautifulSoup(open('../data/E5000317-2.html').read())

rows = soup.find_all('tr')
wknr = name = None
store = {}


def v(val):
    if val == '-':
        return 0
    return int(val)

for row in rows:
    cols = row.find_all('td')
    if len(cols) == 1:
        t = cols[0].text.strip()
        if t:
            if t == 'davon:':
                continue
            if t == 'Niedersachsen':
                name = t
                wknr = '00'
            else:
                wknr = t[0:8].strip()
                name = t[8:].strip()
            if wknr not in store:
                store[wknr] = dict(name=name)
                store[wknr]['98'] = dict()
                store[wknr]['03'] = dict()
                store[wknr]['08'] = dict()
            else:
                print 'duplicate wknr', wknr
    elif len(cols) == 7:
        key = cols[0].text.strip()
        if '(' in key:
            party = key[key.index('(') + 1:key.index(')')]
        elif key == u'Gültige Stimmen':
            party = 'total'
        else:
            continue
        store[wknr]['98'][party] = v(cols[1].text)
        store[wknr]['03'][party] = v(cols[2].text)
        store[wknr]['08'][party] = v(cols[3].text)

import json
open('../data/votes-2.json', 'wb').write(json.dumps(store))
