import csv

from config import PATH_DATA, VENUE_ID_MAPPING
from config import CON_VENUE_TOPICS_FILE
from config import S0_ARTICLE_FILE, S0_ARTICLE_TOPIC_FILE

if __name__ == '__main__':
    with open(CON_VENUE_TOPICS_FILE, 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader)
        venue_topic_list = {}
        for row in csv_reader:
            if row[0] not in venue_topic_list:
                venue_topic_list[int(row[0])] = []
            venue_topic_list[int(row[0])].append(int(row[1]))

    with open(PATH_DATA + '/AMiner-Paper.txt', 'r') as f:
        out_article = open(S0_ARTICLE_FILE, 'w')
        out_article_topic = open(S0_ARTICLE_TOPIC_FILE, 'w')

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
                    continue
                title = line[3:-1]

                line = next(f)
                if not line.startswith('#t'):
                    continue
                try:
                    year = int(line[3:-1])
                except ValueError:
                    continue

                line = next(f)
                if not line.startswith('#c'):
                    continue
                venue = line[3:-1]

                if '"' in title:
                    continue

                for v in VENUE_ID_MAPPING.keys():
                    if venue.startswith(v):
                        venue_id = VENUE_ID_MAPPING[v]
                        out_article.write(f'{id},"{title}",{year},{venue_id}\n')
                        for t in venue_topic_list[venue_id]:
                            out_article_topic.write(f'{id},{t}\n')
                        count += 1

                        year_wise[year] = year_wise.get(year, 0) + 1
                        continue

        out_article.close()
