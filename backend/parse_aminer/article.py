from config import PATH_DATA, VENUE_ID_MAPPING

if __name__ == '__main__':
    with open(PATH_DATA + '/AMiner-Paper.txt', 'r') as f:
        out = open(PATH_DATA + '/s0/article.csv', 'w')
        out.write('id,title,year,venue_id\n')

        count = 0
        while (True):
            # if count == 100:
            #     break

            try:
                line = next(f)
            except StopIteration:
                break

            if line.startswith('#index'):
                id = line[7:-1]

                line = next(f)
                if not line.startswith('#*'):
                    print('Error: no title, id:', id)
                    break
                title = line[3:-1]

                line = next(f)
                if not line.startswith('#t'):
                    print('Error: no year, id:', id)
                    break
                try:
                    year = int(line[3:-1])
                except ValueError:
                    # print('Error: no year, id:', id)
                    continue

                line = next(f)
                if not line.startswith('#c'):
                    print('Error: no venue, id:', id)
                    break
                venue = line[3:-1]

                for v in VENUE_ID_MAPPING.keys():
                    if venue.startswith(v):
                        out.write(f'{id},{title},{year},{VENUE_ID_MAPPING[v]}\n')
                        print(id, year, VENUE_ID_MAPPING[v])
                        count += 1
                        continue
