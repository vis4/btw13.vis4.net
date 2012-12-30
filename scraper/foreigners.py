# encoding: utf-8
# scraper für ausländerzahlen

# schreibt JSON
#

from bs4 import BeautifulSoup

soup = BeautifulSoup(open('../data/E1000124.html').read())

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
    if len(cols) == 10:
        t = cols[0].text.strip()
        if t:
            if t == 'Niedersachsen':
                name = t
                wknr = '00'
            else:
                wknr = t[0:8].strip()
                name = t[8:].strip()
            if wknr not in store:
                store[wknr] = dict(name=name, foreigners=v(cols[7].text), total=v(cols[1].text))
            else:
                print 'duplicate wknr'


import json
open('../data/foreigners.json', 'wb').write(json.dumps(store))
