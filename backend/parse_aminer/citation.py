from config import PATH_DATA
from config import S0_ARTICLE_FILE, S1_CITED_BY_FILE

if __name__ == '__main__':
    with open(S0_ARTICLE_FILE, 'r') as in_article:
        next(in_article)
        article_list = []
        for line in in_article:
            article_list.append(int(line.split(',')[0]))
    article_list = sorted(list(set(article_list)))

    index = 0
    with open(PATH_DATA + '/AMiner-Paper.txt', 'r') as f:
        out = open(S1_CITED_BY_FILE, 'w')
        out.write('article_id_1,article_id_2\n')

        article_id = article_list[index]
        count = 0
        while (True):
            # if count == 100:
            #     break

            try:
                line = next(f)
            except StopIteration:
                break

            if line.startswith('#index'):
                id = int(line[7:-1])

                while article_id < id:
                    index += 1
                    if index < len(article_list):
                        article_id = article_list[index]
                    else:
                        article_id = None
                        break

                if article_id is None:
                    break

                if article_id != id:
                    continue

                next(f)
                next(f)
                next(f)
                while (True):
                    line = next(f)
                    if not line.startswith('#%'):
                        break
                    ref_id = int(line[3:-1])
                    if ref_id in article_list:
                        out.write(f'{ref_id},{article_id}\n')
                        count += 1

        out.close()
