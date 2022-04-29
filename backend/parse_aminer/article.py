import csv

from config import PATH_DATA, VENUE_ID_MAPPING

if __name__ == '__main__':
    with open(PATH_DATA + '/constant/venue_topic.csv', 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader)
        venue_topic_list = {}
        for row in csv_reader:
            if row[0] not in venue_topic_list:
                venue_topic_list[int(row[0])] = []
            venue_topic_list[int(row[0])].append(int(row[1]))

    with open(PATH_DATA + '/AMiner-Paper.txt', 'r') as f:
        out_article = open(PATH_DATA + '/s0/article.csv', 'w')
        out_article_topic = open(PATH_DATA + '/s0/article_topic.csv', 'w')

        out_article.write('id,title,year,venue_id\n')
        out_article_topic.write('article_id,topic_id\n')

        count = 0
        year_wise = {}
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
                        venue_id = VENUE_ID_MAPPING[v]
                        out_article.write(f'{id},"{title}",{year},{venue_id}\n')
                        for t in venue_topic_list[venue_id]:
                            out_article_topic.write(f'{id},{t}\n')
                        print(id, year, venue_id)
                        count += 1

                        year_wise[year] = year_wise.get(year, 0) + 1
                        continue

        out_article.close()
        print(year_wise)
        print(count)
