PATH_DATA = 'data'
PATH_INSERT_CYPHER = 'insert.cypher'

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
        'attrs': ['id', 'name', 'country', 'n_pubs', 'n_citations', 'h_index']
    },
    'Institute': {
        'csv': 'institute', 
        'attrs': ['id', 'name', 'country', 'n_members', 'n_pubs', 'n_citations']
    },
    'Venue' : {
        'csv' : 'venue', 
        'attrs' : ['id', 'name', 'acronym', 'avg_citations', 'flexibility']
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
    'InstituteMember': {'csv': 'institute_member', 'between': ('Institute', 'Author'), 'attrs' : []},
    'AuthorArticle': {'csv': 'author_article', 'between': ('Author', 'Article'), 'attrs' : []},
    'AuthorTopic': {'csv': 'author_topic', 'between': ('Author', 'Topic'), 'attrs' : []},
    'ArticleTopic': {'csv': 'article_topic', 'between': ('Article', 'Topic'), 'attrs' : []},
    'VenueTopic': {'csv': 'venue_topic', 'between': ('Venue', 'Topic'), 'attrs' : []},
    'CitedBy': {'csv': 'cited_by', 'between': ('Article', 'Article'), 'attrs' : []},
    'Coauthor': {'csv': 'coauthor', 'between': ('Author', 'Author'), 'attrs' : ['n_colab']},
}