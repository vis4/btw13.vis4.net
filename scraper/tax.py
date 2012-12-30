# encoding: utf-8
# scraper für Einkommenssteuer

# schreibt JSON
#

from bs4 import BeautifulSoup

soup = BeautifulSoup(open('../data/E9200003.html').read())

rows = soup.find_all('tr')
wknr = name = None
store = {}


def v(val):
    try:
        return int(val)
    except:
        return val


for row in rows:
    cols = row.find_all('td')
    if len(cols) == 14:
        t = cols[0].text.strip()
        if t:
            if t == 'Niedersachsen':
                name = t
                wknr = '00'
            else:
                wknr = t[0:8].strip()
                name = t[8:].strip()
            if wknr not in store:
                store[wknr] = dict(name=name, tax=v(cols[10].text))
            else:
                print 'duplicate wknr'


import json
open('../data/tax.json', 'wb').write(json.dumps(store))
