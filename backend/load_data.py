import os
import csv
from config import *

def createNodes(f, path_base):

    for node in sorted(NODES.keys()):

        table = NODES[node]['csv']
        attr = NODES[node]['attr']
        fpath = os.path.join(path_base, table + '.csv')

        with open(fpath, 'r') as c:

            reader = csv.reader(c)
            next(reader)

            for row in reader:
                idx = int(row[0])
                val = row[1]
                ID2VAL[node][idx] = val
                stmt = f'CREATE ({node.lower()}_{idx}:{node} {{ {attr} : \"{val}\" }});'
                f.write(stmt)
                f.write('\n')
            f.write('\n')
        f.write('\n')


def createRelations(f, path_base):

    for rel in sorted(RELS.keys()):

        between = RELS[rel]['between']
        table = RELS[rel]['csv']
        fpath = os.path.join(path_base, table + '.csv')

        with open(fpath, 'r') as c:

            reader = csv.reader(c)
            next(reader)

            for i, row in enumerate(reader):

                node1 = between[0]
                node2 = between[1]

                node1_id = int(row[0])
                node2_id = int(row[1])

                node1_val = ID2VAL[node1][node1_id]
                node2_val = ID2VAL[node2][node2_id]

                node1_attr = NODES[node1]['attr']
                node2_attr = NODES[node2]['attr']

                stmt = f'MATCH (a:{node1}), (b:{node2}) WHERE a.{node1_attr} = \"{node1_val}\" AND b.{node2_attr} = \"{node2_val}\" CREATE (a)-[{rel.lower()}_{i}:{rel}]->(b);\n'
                f.write(stmt)

            f.write('\n')
        f.write('\n')


if __name__ == '__main__':

    with open(PATH_LOAD_CYPHER, 'w+') as f:

        # Delete all nodes/relationships present
        f.write('MATCH (n) DETACH DELETE n;\n\n')

        createNodes(f, PATH_DATA)
        createRelations(f, PATH_DATA)
