import ijson
import json

import config


def pretty(data):
    return json.dumps(data, indent=4, sort_keys=True)


if __name__ == '__main__':
    with open(config.PATH_DATA + '/extracted.json', 'r') as f:
        out = open(config.PATH_DATA + '/cv.json', 'w')
        out.write('[\n')

        parse_events = ijson.parse(f)

        count = 0
        first = True
        for obj in ijson.items(parse_events, 'item'):
            count += 1
            if count % 10000 == 0:
                print(count)

            if obj['venue'].get('_id', None) in config.VENUE_ID_MAP.keys():
                if not first:
                    out.write(',\n')
                else:
                    first = False

                obj['venue'] = {
                    '_id': obj['venue']['_id'],
                    'name': config.VENUE_ID_MAP[obj['venue']['_id']]
                }
                out.write(pretty(obj))

            # if count == 100:
            #     break

        print(count)

        out.write('\n]\n')
        out.close()
