import csv

db = {}

with open('megaGymDataset.csv', 'rt') as fp:
    r = csv.reader(fp)
    
    for l in r:
        #ID,Title,Desc,Type,BodyPart,Equipment,Level,Rating,RatingDesc
        if not all(l[0:7]):
            continue

        if l[4] not in db.keys():
            db[l[4]] = []

        db[l[4]].append({
            'id': int(l[0]),
            'title': l[1],
            'desc': l[2],
            'type': l[3],
            'equipment': l[5],
            'level': l[6]
        })

import json
with open('exercises.json', 'wt') as fp:
    json.dump(db, fp)