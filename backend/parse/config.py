PATH_DATA = "../data"

publ_records = [
    # 'article',
    'inproceedings',
    # 'proceedings',
    # 'book',
    # 'incollection',
    # 'phdthesis',
    # 'mastersthesis',
    # 'www'
]

publtypes = [
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

split = {
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

publ_stats = {
    'article': split.copy(),
    'inproceedings': split.copy(),
    'proceedings': split.copy(),
    'book': split.copy(),
    'incollection': split.copy(),
    'phdthesis': split.copy(),
    'mastersthesis': split.copy(),
    'www': split.copy()
}