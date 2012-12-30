# encoding: utf-8
# scraper für sozialversicherungspflichtige beschäftigte
# schreibt JSON
#

from bs4 import BeautifulSoup

soup = BeautifulSoup(open('../data/E70A2021.html').read())

rows = soup.find_all('tr')
wknr = name = None
store = {}

for row in rows:
    cols = row.find_all('td')
    if len(cols) == 7:
        t = cols[0].text.strip()
        if t:
            if t == 'Niedersachsen':
                name = t
                wknr = '00'
            else:
                wknr = t[0:8].strip()
                name = t[8:].strip()
            if wknr not in store:
                store[wknr] = dict(name=name, workers=int(cols[6].text))
            else:
                print 'duplicate wknr'


import json
open('../data/workers.json', 'wb').write(json.dumps(store))
