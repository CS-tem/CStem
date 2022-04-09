import ijson
import json

import config


def pretty(data):
    return json.dumps(data, indent=4, sort_keys=True)


if __name__ == '__main__':
    with open(config.PATH_DATA + '/cleaned.json', 'r') as f:
        out = open(config.PATH_DATA + '/extracted.json', 'w')
        out.write('[\n')

        parse_events = ijson.parse(f)

        count = 0
        for obj in ijson.items(parse_events, 'item'):
            count += 1
            if count % 10000 == 0:
                print(count)

            if obj.get('venue') is not None:
                extracted = {}
                for key in config.ESSENTIAL_KEYS:
                    extracted[key] = obj.get(key, None)
                out.write(pretty(extracted))

                out.write(',\n')
            # if count == 100:
            #     break

        print(count)

        out.write(']\n')
        out.close()
