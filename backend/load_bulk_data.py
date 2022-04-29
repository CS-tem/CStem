import os

import pandas as pd

from config import NODES, RELS, PATH_CSV_FINAL

from py2neo import Graph
from py2neo.bulk import create_nodes, create_relationships


BATCH_SIZE = 10000 # change this accordingly


def pyType(v):
    try:
        f = float(v)
        i = int(f)
        if i == f:
            o = int(i)
        else:
            o = f
    except Exception:
        o = str(v)
    return o


def createNodes(g, path_base):

    for node in sorted(NODES.keys()):

        table = NODES[node]['csv']
        attrs = NODES[node]['attrs']
        fpath = os.path.join(path_base, table + '.csv')

        df = pd.read_csv(fpath)
        n_rows = len(df)

        data = []
        for idx in range(n_rows):
            row = df.iloc[idx]
            vals = [row[a] for a in attrs]
            typed_vals = [pyType(v) for v in vals]
            data.append(typed_vals)
            l_data = len(data)
            if l_data % BATCH_SIZE == 0 and l_data != 0:
                create_nodes(g.auto(), data, labels = {node}, keys = attrs)
                data = []

        if len(data) != 0:
            create_nodes(g.auto(), data, labels = {node}, keys = attrs)
            data = []



def createRelations(g, path_base):

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

        data = []
        for idx in range(n_rows):

            row = df.iloc[idx]

            if n_attrs > 0:
                vals = [row[a] for a in attrs]
                typed_vals = [pyType(v) for v in vals]
                props = {k:v for k, v in zip(attrs, typed_vals)}
            else:
                props = {}

            node1_id = row[cols[0]]
            node2_id = row[cols[1]]

            data.append((str(node1_id), props, str(node2_id)))

            l_data = len(data)
            if l_data % BATCH_SIZE == 0 and l_data != 0:
                create_relationships(
                    g.auto(), 
                    data, 
                    rel, 
                    start_node_key = (node1, 'id'),
                    end_node_key = (node2, 'id')
                )
                data = []

        if len(data) != 0:
            create_relationships(
                g.auto(), 
                data, 
                rel, 
                start_node_key = (node1, 'id'),
                end_node_key = (node2, 'id')
            )
            data = []


if __name__ == '__main__':

    g = Graph()
    createNodes(g, PATH_CSV_FINAL)
    createRelations(g, PATH_CSV_FINAL)

    
