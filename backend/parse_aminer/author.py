import csv

from config import PATH_DATA

if __name__ == '__main__':
    with open('/home/devansh/PROJECTS/CSrankings/csrankings.csv', 'r') as csr:
        csv_reader = csv.reader(csr, delimiter=',')
        next(csv_reader)
        author_dict = {}
        for row in csv_reader:
            author_dict[row[0]] = row[1]

    with open(PATH_DATA + '/constant/country.csv', 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader)
        country_dict = {}
        id = 0
        for row in csv_reader:
            country_dict[row[0].lower()] = id
            id += 1

    with open(PATH_DATA + '/s0/institute.csv', 'r') as f:
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader)
        institute_dict = {}
        for row in csv_reader:
            institute_dict[row[1]] = row[0]

    with open(PATH_DATA + '/s1/author_id.csv', 'r') as in_author:
        next(in_author)
        with open(PATH_DATA + '/AMiner-Author.txt', 'r') as f:
            out_author = open(PATH_DATA + '/s2/author.csv', 'w')
            out_author_country = open(PATH_DATA + '/s2/author_country.csv', 'w')
            out_author_institute = open(PATH_DATA + '/s2/institute_member.csv', 'w')

            out_author.write('id,name\n')
            out_author_country.write('author_id,country_id\n')
            out_author_institute.write('institute,author_id\n')

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
                        print('Error: no name')
                        break
                    names = line[3:-1].split(';')

                    for name in names:
                        institute = author_dict.get(name, None)
                        if institute is not None:
                            break
                    if institute is None:
                        institute = 'IIT Bombay'
                        name = names[0]

                    out_author.write(f'{id},"{name}"\n')
                    out_author_country.write(f'{id},{country_dict["in"]}\n')
                    out_author_institute.write(f'{institute_dict["IIT Bombay"]},{id}\n')
                    print(id, name, institute)
                    count += 1
            out_author.close()
            out_author_country.close()
            out_author_institute.close()
