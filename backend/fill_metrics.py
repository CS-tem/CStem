import argparse
from config import *
from pyspark.sql import SparkSession

parser = argparse.ArgumentParser()
parser.add_argument("-e","--entity", required = True)
args = parser.parse_args()

def csv2df(path):
    df = spark.read.options(inferSchema = True, header = True).csv(path)
    return df

if __name__ == "__main__":

    # Args
    ent = args.entity

    # Start
    spark = SparkSession.builder.appName('CStem').getOrCreate()

    # Load DFs
    if ent == 'article':
        df_article = csv2df(f'{PATH_CSV}/article.csv')
        df_cite = csv2df(f'{PATH_CSV}/cited_by.csv')
    elif ent == 'author':
        df_article = csv2df(f'{PATH_CSV}/article.csv')
        df_author = csv2df(f'{PATH_CSV}/author.csv')
        df_aa = csv2df(f'{PATH_CSV}/author_article.csv')
    elif ent == 'institute':
        df_inst = csv2df(f'{PATH_CSV}/institute.csv')
        df_im = csv2df(f'{PATH_CSV}/institute_member.csv')
        df_author = csv2df(f'{PATH_CSV}/author.csv')
    elif ent == 'topic':
        df_topic = csv2df(f'{PATH_CSV}/topic.csv')
        df_art = csv2df(f'{PATH_CSV}/article_topic.csv')
        df_aut = csv2df(f'{PATH_CSV}/author_topic.csv')
        df_article = csv2df(f'{PATH_CSV}/article.csv')

    # Article metrics
    if ent == 'article':
        n_cit = df_cite.groupBy('article_id_1').count()
        df_article = df_article.join(n_cit, [df_article.id == n_cit.article_id_1], 'leftouter')
        df_article = df_article.select('id', 'title', 'venue_id', 'count').\
                     withColumnRenamed('count', 'n_citations').\
                     fillna(0)
        df_article.toPandas().to_csv(f'{PATH_CSV}/article.csv', index = False)

    # Author metrics
    elif ent == 'author':
        df_aac = df_aa.join(df_article, [df_aa.article_id == df_article.id], 'leftouter').\
                 select('author_id', 'article_id', 'n_citations')
        temp = df_aac.groupBy('author_id').agg({'article_id': 'count', 'n_citations' : 'sum'})
        df_author = df_author.join(temp, [df_author.id == temp.author_id], 'leftouter')
        df_author = df_author.select('id', 'name', 'count(article_id)', 'sum(n_citations)', 'h_index').\
                    withColumnRenamed('count(article_id)', 'n_pubs').\
                    withColumnRenamed('sum(n_citations)', 'n_citations').\
                    fillna(0)
        df_author.toPandas().to_csv(f'{PATH_CSV}/author.csv', index = False)

    # Institute metrics
    elif ent == 'institute':
        df_ima = df_im.join(df_author, [df_im.author_id == df_author.id], 'leftouter').\
                 select('institute_id', 'author_id', 'n_pubs', 'n_citations')
        temp = df_ima.groupBy('institute_id').agg({'author_id': 'count', 'n_pubs' : 'sum', 'n_citations' : 'sum'})
        df_inst = df_inst.join(temp, [df_inst.id == temp.institute_id], 'leftouter')
        df_inst = df_inst.select('id', 'name', 'country_id', 'count(author_id)', 'sum(n_pubs)', 'sum(n_citations)').\
                  withColumnRenamed('count(author_id)', 'n_members').\
                  withColumnRenamed('sum(n_pubs)', 'n_pubs').\
                  withColumnRenamed('sum(n_citations)', 'n_citations').\
                  fillna(0)
        df_inst.toPandas().to_csv(f'{PATH_CSV}/institute.csv', index = False)

    # Topic metrics
    elif ent == 'topic':
        df_arta = df_art.join(df_article, [df_article.id == df_art.article_id], 'leftouter').\
                  select('article_id', 'topic_id', 'n_citations').\
                  groupBy('topic_id').\
                  agg({'article_id': 'count', 'n_citations' : 'sum'}).\
                  withColumnRenamed('count(article_id)', 'n_articles').\
                  withColumnRenamed('sum(n_citations)', 'n_citations').\
                  fillna(0)
        df_autg = df_aut.groupBy('topic_id').count()
        df_topic = df_topic.join(df_autg, [df_autg.topic_id == df_topic.id], 'leftouter').\
                   select('id', 'name', 'count').\
                   withColumnRenamed('count', 'n_authors').\
                   fillna(0)
        df_topic = df_topic.join(df_arta, [df_arta.topic_id == df_topic.id], 'leftouter').\
                   select('id', 'name', 'n_articles', 'n_authors', 'n_citations').\
                   fillna(0) 
        df_topic.toPandas().to_csv(f'{PATH_CSV}/topic.csv', index = False)

    # Stop
    spark.stop()
