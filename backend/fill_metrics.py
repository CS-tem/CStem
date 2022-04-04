from config import *
from pyspark.sql import SparkSession

def csv2df(path):
    df = spark.read.options(inferSchema = True, header = True).csv(path)
    return df

if __name__ == "__main__":

    # Start
    spark = SparkSession.builder.appName('CStem').getOrCreate()

    # Load DFs
    df_article = csv2df(f'{PATH_CSV}/article.csv')
    df_cite = csv2df(f'{PATH_CSV}/cited_by.csv')
    
    # Add n_citations in article
    n_cit = df_cite.groupBy('article_id_1').count()
    df_article = df_article.join(n_cit, [df_article.id == n_cit.article_id_1], 'leftouter')
    df_article = df_article.select('id', 'title', 'venue_id', 'count').\
                 withColumnRenamed('count', 'n_citations').\
                 fillna({'n_citations' : '0'})
    df_article.toPandas().to_csv(f'{PATH_CSV}/article.csv', index = False)

    # Stop
    spark.stop()
