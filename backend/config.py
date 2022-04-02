PATH_DATA = 'data'
PATH_INSERT_CYPHER = 'insert.cypher'

TABLES = [
    'contains', 'follows', 'hashtags', 'mentions', 'sent', 'tweets', 'users'
]

NODES = {
    'User': {'csv': 'users', 'attr': 'name'},
    'Tweet': {'csv': 'tweets', 'attr': 'text'},
    'Hashtag':  {'csv': 'hashtags', 'attr': 'tag'},
}

RELS = {
    'MENTIONS': {'csv': 'mentions', 'between': ('Tweet', 'User')},
    'SENT': {'csv': 'sent', 'between': ('User', 'Tweet')},
    'CONTAINS': {'csv': 'contains', 'between': ('Tweet', 'Hashtag')},
    'FOLLOWS': {'csv': 'follows', 'between': ('User', 'User')}
}

ID2VAL = {
    'User': {},
    'Tweet': {},
    'Hashtag': {}
}