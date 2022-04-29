from pickletools import read_uint1
import re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from neoquery import Graph
from typing import Optional
from password import PASSWORD
from pydantic import BaseModel

app = FastAPI()
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

neo_db = Graph(uri='bolt://localhost:7687/', user='neo4j', password=PASSWORD)

@app.get('/')
def test():
    return {'status': 200, 'message': 'test works'}

@app.get('/institutes/{institute_id}')
def get_institutes(institute_id : int):
    query = """
    CALL {{MATCH (i: Institute {{id : {}}})<-[:InstituteCountry]-(j) 
    OPTIONAL MATCH (i)-[:InstituteMember]->(x)-[:AuthorArticle]->(k)-
    [:CitedBy]->(l)
    RETURN i, j.name AS c_name, x,k, COALESCE(COUNT(DISTINCT l),0) AS citations}}
    WITH *
    RETURN i,c_name, sum(citations) AS n_citations ;""".format(institute_id)
    result = neo_db.neo4j_query(query)
    for entry in result:
        entry['i']['country'] = entry['c_name']
        entry['i']['n_citations'] = entry['n_citations']
    return [entry['i'] for entry in result]

@app.get('/institute-members/{institute_id}')
def get_institute_members(institute_id : int):
    query = '''
        CALL {{MATCH (i:Institute{{id : {}}})-[:InstituteMember]->(j)
        OPTIONAL MATCH (j)-[:AuthorArticle]->(k)-[:CitedBy]->(l)
        RETURN i, j,k, COALESCE(COUNT(DISTINCT l),0) as citations}}
        WITH *
        RETURN j, SUM(citations) AS n_citations;
        '''.format(institute_id)

    result = neo_db.neo4j_query(query)
    for entry in result:
        entry['j']['citations'] = entry['n_citations']
    return [entry['j'] for entry in result]

@app.get('/institute-pubs/{institute_id}')
def get_institute_pubs(institute_id : int):
    query = """MATCH (i : Institute{{id: {}}})-[:InstituteMember]->
                (j : Author)-[:AuthorArticle]->(k: Article)
                RETURN  COUNT(k.id) AS n_pubs, 
                k.year as year ORDER BY year""".format(institute_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/institute-citations/{institute_id}')
def get_institute_citations(institute_id : int):
    query = """
    CALL {{MATCH (i : Institute{{id: {}}})-[:InstituteMember]->(j : Author)-[:AuthorArticle]->(k: Article)
    OPTIONAL MATCH (k)-[:CitedBy]->(l) RETURN 
    j,COALESCE(COUNT(DISTINCT l),0) AS citations, k.year as year ORDER BY year}}
    WITH *
    RETURN SUM(citations) AS n_citations, year;""".format(institute_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/institutes/')
def get_institutes():
    query = """
    CALL {MATCH (i: Institute)<-[:InstituteCountry]-(j) 
    OPTIONAL MATCH (i)-[:InstituteMember]->(x)-[:AuthorArticle]->(k)-
    [:CitedBy]->(l)
    RETURN i, j.name AS c_name, x,k, COALESCE(COUNT(DISTINCT l),0) AS citations}
    WITH *
    RETURN i,c_name, sum(citations) AS n_citations ;"""
    result = neo_db.neo4j_query(query)
    for entry in result:
        entry['i']['country'] = entry['c_name']
        entry['i']['n_citations'] = entry['n_citations']
    return [entry['i'] for entry in result]

@app.get('/author/{author_id}')
def get_author(author_id : int):
    query = """
    CALL {{MATCH (i:Author{{id : {}}})
    OPTIONAL MATCH (i)-[:AuthorArticle]->(j)-[:CitedBy]->(k)
    RETURN i, j, COALESCE(COUNT(DISTINCT k), 0) AS citations}}
    WITH *
    RETURN i, COALESCE(SUM(citations),0) AS n_citations;""".format(author_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/authors-top5pubs/{author_id}')
def get_authors_top5(author_id : int):
    query = """MATCH (i:Author{{id : {}}})-[:AuthorArticle]->(j)
    OPTIONAL MATCH (j)-[:CitedBy]->(k)
    RETURN j,COALESCE(COUNT(DISTINCT k),0) AS citations ORDER BY citations DESC, j.year LIMIT 5;""".format(author_id)
    result = neo_db.neo4j_query(query)
    for entry in result:
        entry['j']['citations'] = entry['citations']
    return [entry['j'] for entry in result]

@app.get('/authors/')
def get_authors():
    query = """
    CALL {MATCH (i: Author)
    OPTIONAL MATCH (i)-[:AuthorArticle]->(j)-[:CitedBy]->(k)
    RETURN i,j, COALESCE(COUNT(DISTINCT k),0) as cits}
    WITH *
    RETURN i, SUM(cits) AS n_citations;"""
    result = neo_db.neo4j_query(query)
    for entry in result:
        entry['i']['n_citations'] = entry['n_citations']
    return [entry['i'] for entry in result]

@app.get('/author-pubs/{author_id}')
def get_author_pubs(author_id : int):
    query = """MATCH (i : Author{{id: {}}})-[:AuthorArticle]->(j : Article)
        RETURN count(j.id) AS n_pubs, j.year as year ORDER BY year;""".format(author_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/author-citations/{author_id}')
def get_author_citations(author_id : int):
    query = """
    MATCH(j : Author{{id: {}}})-[:AuthorArticle]->(k: Article)
    OPTIONAL MATCH (k)-[:CitedBy]->(l) RETURN 
    COALESCE(COUNT(DISTINCT l),0) AS n_citations, k.year as year
    ORDER BY year;""".format(author_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/author-pubs-per-topic/{author_id}')
def get_author_pubs_per_topic(author_id : int):
    query = """MATCH(j : Author{{id: {}}})-[:AuthorArticle]->
            (k: Article)<-[:ArticleTopic]-(i:Topic)
            RETURN COUNT(k.id) AS n_pubs, i.name AS topic
            ORDER BY topic LIMIT 5""".format(author_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/author-colab/{query_str}')
def get_author_colabs(query_str : str):
    qlist = query_str.split('-')
    author_id = qlist[0]
    k = qlist[1]
    query = f"""
    CALL{{
        MATCH (a1 {{id: {author_id}}})-[r:Coauthor]-(a2)  
        RETURN a1, a2
        ORDER BY r.n_colab
        LIMIT {k}
    }}
    UNWIND a2 as ua2
    WITH collect(DISTINCT ua2) + a1 as V
    MATCH (v1)-[r:Coauthor]-(v2)
    WHERE v1 in V and v2 in V
    RETURN v1, v2, r.n_colab as n_colab"""
    result = neo_db.neo4j_query(query)
    return result

@app.get('/articles/')
def get_articles():
    # query = 'MATCH (i: Article) RETURN i;'
    query = """MATCH (i: Article), (v: Venue {id : i.venue_id})
    OPTIONAL MATCH (i)-[:CitedBy]->(j)
    RETURN i, COALESCE(COUNT(DISTINCT j),0) AS n_citations, v.acronym as vacr;"""
    result = neo_db.neo4j_query(query)
    for entry in result:
        entry['i']['vacr'] = entry['vacr'] 
        entry['i']['n_citations'] = entry['n_citations']
    return [entry['i'] for entry in result]

@app.get('/articles/{article_id}')
def get_articles(article_id : int):
    query = """
    MATCH  (i : Article{{id: {}}}), (v: Venue{{id : i.venue_id}})
    OPTIONAL MATCH (i)-[:CitedBy]->(l) 
    MATCH (i)<-[:AuthorArticle]-(a)
    MATCH (i)<-[:ArticleTopic]-(t)
    RETURN i,COALESCE(COUNT(DISTINCT l),0) as citations,v.name as vname, v.acronym as vacr,
    a.name as a_name, t.name as topic;""".format(article_id)
    # query = 'MATCH (i : Article{{id : {}}}) RETURN i;'.format(article_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/article-citations/{article_id}')
def get_article_citations(article_id : int):
    query = """
    MATCH (i : Article{{id : {}}})
    OPTIONAL MATCH (i)-[:CitedBy]->(j)
    RETURN COALESCE(COUNT(DISTINCT j),0) AS n_citations, j.year AS year ORDER BY year;""".format(article_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/article-cited-by/{article_id}')
def get_article_cited_by(article_id : int):
    query = """
    MATCH (i : Article{{id : {}}})-[:CitedBy]->(j)
    RETURN j;""".format(article_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/article-cited-from/{article_id}')
def get_article_cited_from(article_id : int):
    query = """
    MATCH (i : Article{{id : {}}})<-[:CitedBy]-(j)
    RETURN j;""".format(article_id)
    result = neo_db.neo4j_query(query)
    
    return result

@app.get('/venue-citations/{venue_id}')
def get_venue_citations(venue_id : int):
    query = """CALL {{MATCH (i : Article{{venue_id: {}}})
    OPTIONAL MATCH (i)<-[:CitedBy]-(l)
    RETURN i, COALESCE(COUNT(DISTINCT l),0) AS citations, i.year as year ORDER BY year}}
    RETURN SUM(citations) AS n_citations, i.year AS year ORDER BY year""".format(venue_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/venue-pubs/{venue_id}')
def get_venue_pubs(venue_id : int):
    query = """MATCH (i : Article{{venue_id: {}}})	
	RETURN count(i.id) AS n_pubs, i.year as year ORDER BY year;""".format(venue_id)
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
    return [entry['i'] for entry in result]
    
@app.get('/topic-citations/{topic_id}')
def get_topic_citations(topic_id : int):
    query = """MATCH (i : Topic{{id: {}}})-[:ArticleTopic]->(j : Article)
    OPTIONAL MATCH (j)<-[:CitedBy]-(l) RETURN 
    COALESCE(COUNT(DISTINCT l),0) AS n_citations, j.year as year ORDER BY year;""".format(topic_id)
    result = neo_db.neo4j_query(query)
    return result

@app.get('/topic-pubs/{topic_id}')
def get_topic_pubs(topic_id : int):
    query = """MATCH (i : Topic{{id: {}}})-[:ArticleTopic]->(j : Article)
    RETURN count(j.id) AS n_pubs,  j.year as year ORDER BY year;""".format(topic_id)
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
    return [entry['i'] for entry in result]


### queries for recomputation ### 

#topic selected articles
@app.get('/articles/selected-topics/{topic_id}') #assumed a '-' separated string will be given here 
def get_topics(topic_id : str,q: Optional[str] = None):
    if q:
        topics = q
    topics = topic_id.split('-')
    topics = list(map(int, topics))
    query = """MATCH (j : Topic)-[:ArticleTopic]->(i: Article)
                WHERE j.id IN {}
                RETURN i,j""".format(topics)
    result = neo_db.neo4j_query(query)
    return result

#country selected Institutes
@app.get('/institutes/selected-countries/{cnt_str}') #assumed a '-' separated string will be given here 
def get_topics(cnt_str : str,q: Optional[str] = None):
    if q:
        countries = q
    countries = cnt_str.split('-')
    query = """MATCH (i: Institute)<-[:InstituteCountry]-(j: Country) 
            WHERE j.name in {}
            RETURN i;""".format(countries)

    result = neo_db.neo4j_query(query)
    return result

#Type selected venues
@app.get('/venues/selected-types/{type_string}') #assumed a '-' separated string will be given here 
def get_topics(type_string : str,q: Optional[str] = None):
    if q:
        venues = q
    venues = type_string.split('-')
    query = """MATCH (i: Venue)
            WHERE i.type in {}
            RETURN i;""".format(venues)
    result = neo_db.neo4j_query(query)
    return result

#citation graph based on depths
@app.get('/article/citation-graph/{query_str}') #article_id-depth_upperbound
def get_citation_graph(query_str : str,q: Optional[str] = None):
    if q:
        query = q
    query = query_str.split('-')
    article_id = query[0]
    depth = query[1]
    query = """MATCH (i : Article{{id:{}}})
        OPTIONAL MATCH r=(i)-[:CitedBy*..]->(j)
        WITH r, length(r) AS depth
        WHERE depth <= {}
        RETURN nodes(r) as nodes;""".format(article_id, depth)
    result = neo_db.neo4j_query(query)
    return result    

class NewAuthorsCondition(BaseModel):
    frm: int
    to: int
    topics: list

@app.post('/new-authors-info/')
def post_new_authors_info(request: NewAuthorsCondition):
    query = """
    CALL {{MATCH (i: Author)-[:AuthorArticle]->(j)<-[:ArticleTopic]-(x)
    WHERE j.year >={} AND j.year <={} AND x.name in {}
    RETURN i, COALESCE(count(DISTINCT j),0) AS n_pubs}}
    CALL {{ WITH *  MATCH (a: Author)-[:AuthorArticle]->(b)
    OPTIONAL MATCH (b)-[:CitedBy]->(k)
    WHERE b.year >= {} AND b.year <= {} AND k.year >= {} AND k.year <= {}
    RETURN a,b,COALESCE(COUNT(DISTINCT k),0) AS n_cits}}
    RETURN i, n_pubs, COALESCE(SUM(CASE WHEN a.id = i.id THEN n_cits ELSE 0 END),0) AS n_citations;""".format(
        request.frm, request.to, request.topics, request.frm, request.to, request.frm, request.to
    )
    result = neo_db.neo4j_query(query)
    return result

@app.get('/countries/')
def get_venues():
    query = 'MATCH (i : Country) RETURN i;'
    result = neo_db.neo4j_query(query)
    return [entry['i'] for entry in result]

class VenuesByCondition(BaseModel):
    topics : list
    types: list

@app.post('/venues-by-condition/')
def get_venues_by_condition(request: VenuesByCondition):
    query = query = '''MATCH (i: Venue)<-[r: VenueTopic]-(j) WHERE 
        i.type IN {} AND j.name in {} RETURN DISTINCT i;'''.format(
            request.types, request.topics
        )
    result = neo_db.neo4j_query(query)
    return [entry['i'] for entry in result]

class NewInstitutesCondition(BaseModel):
    frm : int
    to : int
    topics : list
    countries: list

@app.post('/new-institutes-info/')
def post_new_institutes_info(request: NewInstitutesCondition):
    query1 = """
    CALL {{MATCH (c:Country)-[:InstituteCountry]->(i: Institute)-[:InstituteMember]
    ->(j)-[:AuthorArticle]->(k)<-[:ArticleTopic]-(l)
    WHERE c.name in {} AND 
    k.year >= {} AND k.year <= {} AND 
    l.name IN {}
    RETURN c.name as cntry, i,j, COALESCE(COUNT(DISTINCT k),0) AS n_pub
    }}
    RETURN cntry, i, SUM(n_pub) AS n_pubs
    """.format(request.countries, request.frm, request.to, request.topics)
   
    result1 = neo_db.neo4j_query(query1)

    query2 = """
    CALL {{MATCH (c:Country)-[:InstituteCountry]->(i: Institute)-[:InstituteMember]
    ->(j)-[:AuthorArticle]->(k)<-[:ArticleTopic]-(l)
    MATCH (k)-[:CitedBy]->(m)
    WHERE c.name in {} AND 
    k.year >= {} AND k.year <= {} AND
    l.name IN {}
    RETURN c.name as cntry, i,j, k, COALESCE(COUNT(DISTINCT m),0) AS n_cits
    }}
    CALL {{
        WITH cntry, i, j, k, n_cits
        RETURN i AS i0,j AS j0, SUM(n_cits) AS n_citation
    }}
    WITH *
    RETURN cntry, i, SUM(n_citation) AS n_citations;
    """.format(request.countries, request.frm, request.to, request.topics)

    result2 = neo_db.neo4j_query(query2)
    return result1, result2


class NewVenuesCondition(BaseModel):
    frm : int
    to : int
    venues : list

@app.post('/new-articles-info/')
def post_new_articles_info(request: NewVenuesCondition):
    query = """
    MATCH (i: Article)
    MATCH (j: Venue{id : i.venue_id})
    WHERE j.acronym IN {}
    AND i.year >= {} AND i.year <= {}
    RETURN i,j.acronym AS acronym
    """.format(request.venues, request.frm, request.to)
    result = neo_db.neo4j_query(query)
    return result