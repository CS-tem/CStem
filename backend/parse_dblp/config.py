import os

PATH_BASE = os.path.dirname(os.path.dirname(__file__))
PATH_DATA = f'{PATH_BASE}/data/dblp'

PUBL_RECORDS = [
    # 'article',
    'inproceedings',
    # 'proceedings',
    # 'book',
    # 'incollection',
    # 'phdthesis',
    # 'mastersthesis',
    # 'www'
]

PUBL_TYPES = [
    None,
    # 'informal',
    # 'withdrawn',
    # 'data',
    # 'software',
    # 'survey',
    # 'edited',
    # 'informal withdrawn',
    # 'encyclopedia',
    # 'habil',
    # 'noshow',
    # 'disambiguation',
    # 'group'
]

SPLIT = {
    None: 0,
    'informal': 0,
    'withdrawn': 0,
    'data': 0,
    'software': 0,
    'survey': 0,
    'edited': 0,
    'informal withdrawn': 0,
    'encyclopedia': 0,
    'habil': 0,
    'noshow': 0,
    'disambiguation': 0,
    'group': 0
}

PUBL_STATS = {
    'article': SPLIT.copy(),
    'inproceedings': SPLIT.copy(),
    'proceedings': SPLIT.copy(),
    'book': SPLIT.copy(),
    'incollection': SPLIT.copy(),
    'phdthesis': SPLIT.copy(),
    'mastersthesis': SPLIT.copy(),
    'www': SPLIT.copy()
}
