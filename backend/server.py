from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from neoquery import Graph
from typing import Optional

app = FastAPI()
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

neo_db = Graph(uri='bolt://localhost:7687/', user='neo4j', password='adshaila')

@app.get('/')
def test():
    return {'status': 200, 'message': 'test works'}

@app.get('/institutes/{institute_id}')
def get_institutes(institute_id : int):
    query = 'MATCH (i: Institute {{id : {}}}) RETURN i;'.format(institute_id)
    result = neo_db.neo4j_query(query)
    return [entry['i'] for entry in result]

@app.get('/institute-pubs/{institute_id}')
def get_institute_pubs(institute_id : int):
    query = """MATCH (i : Institute{{id: {}}})-[:InstituteMember]->
                (j : Author)-[:AuthorArticle]->(k: Article)
                RETURN  i AS institute, COUNT(k.id) AS n_pubs, 
                k.year as year ORDER BY year""".format(institute_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/institute-citations/{institute_id}')
def get_institute_citations(institute_id : int):
    query = """
    MATCH (i : Institute{{id: {}}})-[:InstituteMember]->(j : Author)-[:AuthorArticle]->(k: Article) RETURN 
    i AS institute, SUM(k.n_citations) AS n_citations, k.year as year ORDER BY year; """.format(institute_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/institutes/')
def get_institutes():
    query = 'MATCH (i: Institute) RETURN i;'
    result = neo_db.neo4j_query(query)
    return [entry['i'] for entry in result]

@app.get('/authors/{author_id}')
def get_authors(author_id : int):
    query = 'MATCH (i:Author{{id : {}}})-[:AuthorArticle]->(j)RETURN i,j;'.format(author_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/authors/')
def get_authors():
    query = 'MATCH (i: Author) RETURN i;'
    result = neo_db.neo4j_query(query)
    return result

@app.get('/author-pubs/{author_id}')
def get_author_pubs(author_id : int):
    query = """MATCH (i : Author{{id: {}}})-[:AuthorArticle]->(j : Article)
        RETURN i AS author, count(j.id) AS n_pubs, j.year as year ORDER BY year;""".format(author_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/author-citations/{author_id}')
def get_author_citations(author_id : int):
    query = """
    MATCH(j : Author{{id: {}}})-[:AuthorArticle]->(k: Article)
    RETURN j AS author, SUM(k.n_citations) AS n_citations, k.year as year
    ORDER BY year;""".format(author_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/author-pubs-per-topic/{author_id}')
def get_author_pubs_per_topic(author_id : int):
    query = """MATCH(j : Author{{id: {}}})-[:AuthorArticle]->
            (k: Article)<-[:ArticleTopic]-(i:Topic)
            RETURN j AS author, COUNT(k.id) AS n_pubs, i AS topic
            ORDER BY topic""".format(author_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/author-colab/{author_id}')
def get_author_colabs(author_id : int):
    query = """MATCH (j : Author{{id : {}}})-[k:Coauthor]->(i)
            RETURN j AS author1, i AS author2, k.n_colab as n_colab;""".format(author_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/articles/')
def get_articles():
    query = 'MATCH (i: Article) RETURN i;'
    result = neo_db.neo4j_query(query)
    return result

@app.get('/articles/{article_id}')
def get_articles(article_id : int):
    query = 'MATCH (i : Article{{id : {}}}) RETURN i;'.format(article_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/article-citations/{article_id}')
def get_article_citations(article_id : int):
    query = """
    MATCH (i : Article{{id : {}}})-[:CitedBy]->(j)
    RETURN i, COUNT(j) as n_citations, j.year AS Year;""".format(article_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/article-cited/{article_id}')
def get_article_cited(article_id : int):
    query = """
    MATCH (i : Article{{id : {}}})-[:CitedBy]->(j)
    RETURN j;""".format(article_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/venue-citations/{venue_id}')
def get_venue_citations(venue_id : int):
    query = """MATCH (i : Article{{id: {}}})	
	RETURN sum(i.n_citations) AS n_citations, i.year as year ORDER BY year;""".format(venue_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/venue-pubs/{venue_id}')
def get_venue_pubs(venue_id : int):
    query = """MATCH (i : Article{{venue_id: {}}})	
	RETURN count(i.id) AS n_pubs, i.year as year;""".format(venue_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/venues/{venue_id}')
def get_venues(venue_id : int):
    query = """MATCH (i : Venue{{id : {}}}) RETURN i;""".format(venue_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/venues/')
def get_venues():
    query = 'MATCH (i : Venue) RETURN i;'
    result = neo_db.neo4j_query(query)
    return result
    
@app.get('/topic-citations/{topic_id}')
def get_topic_citations(topic_id : int):
    query = """MATCH (i : Topic{id: 2})<-[:ArticleTopic]-(j : Article)
    RETURN i AS topic, sum(j.n_citations) AS n_citations, j.year as year;""".format(topic_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/topic-pubs/{topic_id}')
def get_topic_pubs(topic_id : int):
    query = """MATCH (i : Topic{{id: {}}})<-[:ArticleTopic]-(j : Article)
    RETURN i AS topic, count(j.id) AS n_pubs,  j.year as year;""".format(topic_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/topics/{topic_id}')
def get_topics(topic_id : int):
    query = """MATCH (i : Topic{{id : {}}}) RETURN i;""".format(topic_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/topics/')
def get_topics():
    query = 'MATCH (i : Topic) RETURN i;'
    result = neo_db.neo4j_query(query)
    return result