PATH_DATA = 'data'
PATH_CSV = f'{PATH_DATA}/csv'
PATH_CYPHER = 'insert.cypher'

TABLES = [

    'article',
    'author',
    'institute',
    'venue',
    'topic',
    'country',

    'institute_member',
    'author_article',
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
        'attrs': ['id', 'name', 'country_id', 'n_pubs', 'n_citations', 'h_index']
    },
    'Institute': {
        'csv': 'institute', 
        'attrs': ['id', 'name', 'country', 'n_members', 'n_pubs', 'n_citations']
    },
    'Venue' : {
        'csv' : 'venue', 
        'attrs' : ['id', 'name', 'acronym', 'type', 'avg_citations', 'flexibility']
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
        'direction' : '--',
        'attrs' : []
    },
    'AuthorArticle': {
        'csv': 'author_article', 
        'between': ('Author', 'Article'),
        'direction' : '--',
        'attrs' : []
    },
    'AuthorTopic': {
        'csv': 'author_topic', 
        'between': ('Author', 'Topic'), 
        'direction' : '--',
        'attrs' : []
    },
    'ArticleTopic': {
        'csv': 'article_topic', 
        'between': ('Article', 'Topic'),
        'direction' : '--', 
        'attrs' : []
    },
    'VenueTopic': {
        'csv': 'venue_topic', 
        'between': ('Venue', 'Topic'),
        'direction' : '--', 
        'attrs' : []
    },
    'CitedBy': {
        'csv': 'cited_by', 
        'between': ('Article', 'Article'), 
        'direction' : '<-',
        'attrs' : []
    },
    'Coauthor': {
        'csv': 'coauthor', 
        'between': ('Author', 'Author'), 
        'direction' : '--',
        'attrs' : ['n_colab']
    },
}