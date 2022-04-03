import os
import pandas as pd
from config import *

def pyType(v):
    try:
        o = int(float(v))
    except:
        o = str(v)
    return o

def dir2Cypher(direction):
    if direction == '--':
        return '-', '-'
    elif direction == '->':
        return '-', '->'
    elif direction == '<-':
        return '<-', '-'
    else:
        raise ValueError("Invalid direction")

def propCypher(attrs, vals):
    typed_vals = [pyType(v) for v in vals]
    cypher = ", ".join([f"{a} : {repr(t)}" for a, t in zip(attrs, typed_vals)])
    return cypher

def createNodes(f, path_base):

    for node in sorted(NODES.keys()):

        table = NODES[node]['csv']
        attrs = NODES[node]['attrs']
        fpath = os.path.join(path_base, table + '.csv')

        df = pd.read_csv(fpath)
        n_rows = len(df)

        for idx in range(n_rows):
            row = df.iloc[idx]
            vals = [row[a] for a in attrs]
            props = propCypher(attrs, vals)
            stmt = f'CREATE ({node.lower()}_{idx}:{node} {{ {props} }});'
            f.write(stmt)
            f.write('\n')

        f.write('\n')
    f.write('\n')

def createRelations(f, path_base):

    for rel in sorted(RELS.keys()):

        between = RELS[rel]['between']
        
        node1 = between[0]
        node2 = between[1]
        
        table = RELS[rel]['csv']
        
        attrs = RELS[rel]['attrs']
        n_attrs = len(attrs)

        direction = RELS[rel]['direction']
        d_start, d_end = dir2Cypher(direction)
        
        fpath = os.path.join(path_base, table + '.csv')
        df = pd.read_csv(fpath)
        cols = df.columns
        n_rows = len(df)

        for idx in range(n_rows):

            row = df.iloc[idx]

            if n_attrs > 0:
                vals = [row[a] for a in attrs]
                props = propCypher(attrs, vals)

            node1_id = row[cols[0]]
            node2_id = row[cols[1]]

            match = f'MATCH (a:{node1}), (b:{node2}) WHERE a.id = {node1_id} AND b.id = {node2_id}'
            
            if n_attrs > 0:
                create = f'CREATE (a){d_start}[{rel.lower()}_{i}:{rel} {{ {props} }}]{d_end}(b);\n'
            else:
                create = f'CREATE (a){d_start}[{rel.lower()}_{i}:{rel}]{d_end}(b);\n'

            stmt = f'{match} {create}'
            f.write(stmt)

        f.write('\n')
    f.write('\n')

if __name__ == '__main__':

    with open(PATH_CYPHER, 'w+') as f:

        # Delete all nodes/relationships present
        f.write('MATCH (n) DETACH DELETE n;\n\n')

        createNodes(f, PATH_CSV)
        createRelations(f, PATH_CSV)
