from neo4j import GraphDatabase
import logging
from neo4j.exceptions import ServiceUnavailable

class Graph:
    def __init__(self, uri='bolt://localhost:7687', user='neo4j', password='neo4j'):
        print(user, password)
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def parse_result(self, result):
        return [record.data() for record in result]
    
    def neo4j_query(self, query : str):
        with self.driver.session() as session:
            return self.parse_result(session.run(query))

    def close(self):
        self.driver.close()

if __name__ == '__main__':
    """
    Neo4j testing code.
    """
    graph = Graph(user='neo4j', password='neo4j')
    query = 'MATCH (i: Institute) return i;'
    print(graph.neo4j_query(query))
