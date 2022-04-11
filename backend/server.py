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

@app.get('/authors/')
def get_authors():
    query = 'MATCH (i: Author) RETURN i;'
    result = neo_db.neo4j_query(query)
    return [entry['i'] for entry in result]