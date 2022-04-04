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
        df_aac = df_aa.join(df_article, [df_aa.article_id == df_article.id], 'leftouter').\
                 select('author_id', 'article_id', 'n_citations')
        temp = df_aac.groupBy('author_id').agg({'article_id': 'count', 'n_citations' : 'sum'})
        df_author = df_author.join(temp, [df_author.id == temp.author_id], 'leftouter')
        df_author = df_author.select('id', 'name', 'count(article_id)', 'sum(n_citations)', 'h_index').\
                    withColumnRenamed('count(article_id)', 'n_pubs').\
                    withColumnRenamed('sum(n_citations)', 'n_citations').\
                    fillna({'n_pubs' : '0'})
        df_author.toPandas().to_csv(f'{PATH_CSV}/author.csv', index = False)

    # Institute metrics
    elif ent == 'institute':
        n_mem = df_im.groupBy('institute_id').count()
        df_inst = df_inst.join(n_mem, [df_inst.id == n_mem.institute_id], 'leftouter')
        df_inst = df_inst.select('id', 'name', 'country_id', 'count', 'n_pubs', 'n_citations').\
                  withColumnRenamed('count', 'n_members').\
                  fillna({'n_members' : '0'})
        df_inst.toPandas().to_csv(f'{PATH_CSV}/institute.csv', index = False)

    # Stop
    spark.stop()
