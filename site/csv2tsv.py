import csv;import sys;o=csv.writer(sys.stdout,dialect='excel-tab');[o.writerow(r) for r in csv.reader(sys.stdin)]
