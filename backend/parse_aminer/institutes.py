import re

from config import PATH_DATA, AMINER_AUTHOR

if __name__ == '__main__':
    with open(PATH_DATA + '/AMiner-Author.txt', 'r') as f:
        count = 0
        line = next(f)
        while (True):
            if line.startswith('#index'):
                id = line[7:-1]
                print(id)

                line = next(f)
                if not line.startswith('#n'):
                    print('Error: no name')
                    break
                name = line[3:-1].split(';')
                print(len(name), name)

                line = next(f)
                if not line.startswith('#a'):
                    print('Error: no affiliation')
                    break
                affiliation = line[3:-1].split(';')
                print(len(affiliation), affiliation)

                count += 1

            if count == 100:
                break

            try:
                line = next(f)
            except StopIteration:
                break
