from config import PATH_DATA

if __name__ == '__main__':
    author_list = []
    with open(PATH_DATA + '/s0/article.csv', 'r') as in_article:
        next(in_article)
        with open(PATH_DATA + '/AMiner-Author2Paper.txt', 'r') as f:
            out = open(PATH_DATA + '/s1/author_article.csv', 'w')
            out.write('author_id,article_id\n')

            article_id = int(next(in_article).split(',')[0])
            count = 0
            while (True):
                # if count == 100:
                #     break

                try:
                    line = next(f)
                except StopIteration:
                    break

                vals = list(map(int, line[:-1].split('\t')))
                # print(vals)

                while article_id < vals[2]:
                    try:
                        article_id = int(next(in_article).split(',')[0])
                    except StopIteration:
                        article_id = None
                        break

                if article_id is None:
                    break

                if article_id != vals[2]:
                    continue

                print(vals[0], article_id)
                out.write(f'{vals[1]},{article_id}\n')
                author_list.append(vals[1])
                count += 1

                # count += 1
            out.close()

    author_list = sorted(list(set(author_list)))

    out = open(PATH_DATA + '/s1/author_id.csv', 'w')
    out.write('author_id\n')
    for author_id in author_list:
        out.write(f'{author_id}\n')
    out.close()
