import os

DNAME = "artificial"

PATH_BASE = os.path.dirname(__file__)
PATH_CSV_BASE = f'{PATH_BASE}/data/{DNAME}/pre_spark'
PATH_CSV_FINAL = f'{PATH_BASE}/data/{DNAME}/post_spark'
PATH_CYPHER = f'{PATH_BASE}/insert.cypher'

TABLES = [

    'article',
    'author',
    'institute',
    'venue',
    'topic',
    'country',

    'institute_member',
    'institute_country',
    'author_article',
    'author_country',
    'author_topic'
    'article_topic',
    'venue_topic',
    'cited_by',
    'coauthor',

]

NODES = {
    'Article': {
        'csv': 'article',
        'attrs': ['id', 'title', 'year', 'venue_id', 'n_citations']
    },
    'Author': {
        'csv': 'author',
        'attrs': ['id', 'name', 'n_pubs', 'n_citations', 'h_index']
    },
    'Institute': {
        'csv': 'institute',
        'attrs': ['id', 'name', 'n_members', 'n_pubs', 'n_citations']
    },
    'Venue': {
        'csv': 'venue',
        'attrs': ['id', 'name', 'acronym', 'type', 'n_pubs', 'n_citations', 'flexibility']
    },
    'Topic': {
        'csv': 'topic',
        'attrs': ['id', 'name', 'n_articles', 'n_authors', 'n_citations']
    },
    'Country': {
        'csv': 'country',
        'attrs': ['id', 'name']
    },
}

RELS = {
    'InstituteMember': {
        'csv': 'institute_member',
        'between': ('Institute', 'Author'),
        'direction': '->',
        'attrs': []
    },
    'InstituteCountry': {
        'csv': 'institute_country',
        'between': ('Institute', 'Country'),
        'direction': '<-',
        'attrs': []
    },
    'AuthorArticle': {
        'csv': 'author_article',
        'between': ('Author', 'Article'),
        'direction': '->',
        'attrs': []
    },
    'AuthorCountry': {
        'csv': 'author_country',
        'between': ('Author', 'Country'),
        'direction': '<-',
        'attrs': []
    },
    'AuthorTopic': {
        'csv': 'author_topic',
        'between': ('Author', 'Topic'),
        'direction': '<-',
        'attrs': ['n_pubs']
    },
    'ArticleTopic': {
        'csv': 'article_topic',
        'between': ('Article', 'Topic'),
        'direction': '<-',
        'attrs': []
    },
    'VenueTopic': {
        'csv': 'venue_topic',
        'between': ('Venue', 'Topic'),
        'direction': '<-',
        'attrs': []
    },
    'CitedBy': {
        'csv': 'cited_by',
        'between': ('Article', 'Article'),
        'direction': '->',
        'attrs': []
    },
    'Coauthor': {
        'csv': 'coauthor',
        'between': ('Author', 'Author'),
        'direction': '--',
        'attrs': ['n_colab']
    },
}

INDICES = {
    ('Article', 'id'),
    ('Article', 'year'),
    ('Author', 'id'),
    ('Institute', 'id'),
    ('Venue', 'id'),
    ('Topic', 'id'),
    ('Country', 'id'),
}
