import csv

import random

from config import PATH_DATA
from config import S0_INSTITUTE_COUNTRY_FILE, S1_AUTHOR_ID_FILE
from config import S2_AUTHOR_COUNTRY_FILE, S2_AUTHOR_FILE, S2_INSTITUTE_MEMBER_FILE

if __name__ == '__main__':
    random.seed(0)
    with open(S0_INSTITUTE_COUNTRY_FILE, 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader)
        institute_dict = []
        for row in csv_reader:
            institute_dict.append((int(row[0]), int(row[1])))

    with open(S1_AUTHOR_ID_FILE, 'r') as in_author:
        next(in_author)
        with open(PATH_DATA + '/AMiner-Author.txt', 'r') as f:
            out_author = open(S2_AUTHOR_FILE, 'w')
            out_author_country = open(S2_AUTHOR_COUNTRY_FILE, 'w')
            out_author_institute = open(S2_INSTITUTE_MEMBER_FILE, 'w')

            out_author.write('id,name\n')
            out_author_country.write('author_id,country_id\n')
            out_author_institute.write('institute_id,author_id\n')

            author_id = int(next(in_author)[:-1])
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

                    while author_id < id:
                        try:
                            author_id = int(next(in_author).split(',')[0])
                        except StopIteration:
                            author_id = None
                            break

                    if author_id is None:
                        break

                    if author_id != id:
                        continue

                    line = next(f)
                    if not line.startswith('#n'):
                        break
                    names = line[3:-1].split(';')

                    name = names[0]
                    institute_id, country_id = random.choice(institute_dict)

                    out_author.write(f'{id},"{name}"\n')
                    out_author_country.write(f'{id},{country_id}\n')
                    out_author_institute.write(f'{institute_id},{id}\n')
                    count += 1

            out_author.close()
            out_author_country.close()
            out_author_institute.close()
