from config import *

# Creates CSV files with column headers when testing with manual data

if __name__ == '__main__':

    for n in NODES.keys():
        node = NODES[n]
        csv = node['csv']
        attrs = node['attrs']
        with open(f'{PATH_CSV}/{csv}.csv', 'w+') as f:
            f.write(','.join(attrs))

    for r in RELS.keys():
        rel = RELS[r]
        n1, n2 = rel['between']
        n1, n2 = n1.lower(), n2.lower()
        attrs = rel['attrs']
        csv = rel['csv']
        with open(f'{PATH_CSV}/{csv}.csv', 'w+') as f:
            if len(attrs) == 0:
                if n1 == n2:
                    f.write(f'{n1}_id_1,{n2}_id_2')
                else:
                    f.write(f'{n1}_id,{n2}_id')
            else:
                if n1 == n2:
                    f.write(f'{n1}_id_1,{n2}_id_2,')
                else:
                    f.write(f'{n1}_id,{n2}_id,')
                f.write(','.join(attrs))
    