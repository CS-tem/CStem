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
        df_author = csv2df(f'{PATH_CSV}/author.csv')
        df_aa = csv2df(f'{PATH_CSV}/author_article.csv')
    
    # Article metrics
    if ent == 'article':
        n_cit = df_cite.groupBy('article_id_1').count()
        df_article = df_article.join(n_cit, [df_article.id == n_cit.article_id_1], 'leftouter')
        df_article = df_article.select('id', 'title', 'venue_id', 'count').\
                     withColumnRenamed('count', 'n_citations').\
                     fillna({'n_citations' : '0'})
        df_article.toPandas().to_csv(f'{PATH_CSV}/article.csv', index = False)

    # Author metrics
    elif ent == 'author':
        n_pubs = df_aa.groupBy('author_id').count()
        df_author = df_author.join(n_pubs, [df_author.id == n_pubs.author_id], 'leftouter')
        df_author = df_author.select('id', 'name', 'count', 'n_citations', 'h_index').\
                     withColumnRenamed('count', 'n_pubs').\
                     fillna({'n_pubs' : '0'})
        df_author.toPandas().to_csv(f'{PATH_CSV}/author.csv', index = False)

    # Stop
    spark.stop()
