import argparse
from config import PATH_CSV_BASE, PATH_CSV_FINAL
from pyspark.sql import SparkSession, functions as F
from pyspark.sql.window import Window

# Usage: python3 fill_metrics.py -o article
# Order of computation: article_topic, article, author, institute, topic, venue, author_topic
parser = argparse.ArgumentParser()
parser.add_argument("-o", "--option", required=True)
args = parser.parse_args()


def csv2df(path):
    df = spark.read.options(inferSchema=True, header=True).csv(path)
    return df


if __name__ == "__main__":

    # Args
    opt = args.option

    # Start
    spark = SparkSession.builder.appName('CStem').getOrCreate()

    # Load DFs
    if opt == 'article':
        df_art = csv2df(f'{PATH_CSV_BASE}/article.csv')
        df_cite = csv2df(f'{PATH_CSV_BASE}/cited_by.csv')
    elif opt == 'author':
        df_article = csv2df(f'{PATH_CSV_FINAL}/article.csv')
        df_author = csv2df(f'{PATH_CSV_BASE}/author.csv')
        df_aa = csv2df(f'{PATH_CSV_BASE}/author_article.csv')
    elif opt == 'institute':
        df_inst = csv2df(f'{PATH_CSV_BASE}/institute.csv')
        df_im = csv2df(f'{PATH_CSV_BASE}/institute_member.csv')
        df_author = csv2df(f'{PATH_CSV_FINAL}/author.csv')
    elif opt == 'author_topic':
        df_art = csv2df(f'{PATH_CSV_BASE}/article_topic.csv')
        df_aa = csv2df(f'{PATH_CSV_BASE}/author_article.csv')
    elif opt == 'topic':
        df_topic = csv2df(f'{PATH_CSV_BASE}/topic.csv')
        df_art = csv2df(f'{PATH_CSV_BASE}/article_topic.csv')
        df_aut = csv2df(f'{PATH_CSV_FINAL}/author_topic.csv')
        df_article = csv2df(f'{PATH_CSV_FINAL}/article.csv')
    elif opt == 'venue':
        df_venue = csv2df(f'{PATH_CSV_BASE}/venue.csv')
        df_article = csv2df(f'{PATH_CSV_FINAL}/article.csv')
        df_art = csv2df(f'{PATH_CSV_BASE}/article_topic.csv')
        df_vt = csv2df(f'{PATH_CSV_BASE}/venue_topic.csv')
    elif opt == 'coauthor':
        df_aa = csv2df(f'{PATH_CSV_BASE}/author_article.csv')
    else:
        raise ValueError('Invalid option')

    # Article metrics
    if opt == 'article':
        n_cit = df_cite.groupBy('article_id_1').count()
        df_art = df_art.join(n_cit, [df_art.id == n_cit.article_id_1], 'leftouter')
        df_art = df_art.select('id', 'title', 'year', 'venue_id', 'count').\
            withColumnRenamed('count', 'n_citations').\
            fillna(0)
        df_art.toPandas().to_csv(f'{PATH_CSV_FINAL}/article.csv', index=False)

    # Author metrics
    elif opt == 'author':
        df_aac = df_aa.join(df_article, [df_aa.article_id == df_article.id], 'leftouter').\
            select('author_id', 'article_id', 'n_citations')
        w = Window.partitionBy(df_aac.author_id).orderBy(df_aac.n_citations.desc())  
        df_aac = df_aac.withColumn('rank', F.row_number().over(w))
        temp = df_aac.groupBy('author_id').\
            agg(
                F.count(df_aac.article_id).alias('n_pubs'),
                F.sum(df_aac.n_citations).alias('n_citations'),
                F.max(F.when(df_aac.n_citations >= df_aac.rank, df_aac.rank).otherwise(0)).alias('h_index')
            )
        df_author = df_author.join(temp, [df_author.id == temp.author_id], 'leftouter')
        df_author = df_author.select('id', 'name', 'n_pubs', 'n_citations', 'h_index').fillna(0)
        df_author.toPandas().to_csv(f'{PATH_CSV_FINAL}/author.csv', index=False)

    # Institute metrics
    elif opt == 'institute':
        df_ima = df_im.join(df_author, [df_im.author_id == df_author.id], 'leftouter').\
            select('institute_id', 'author_id', 'n_pubs', 'n_citations')
        temp = df_ima.groupBy('institute_id').agg(
            {'author_id': 'count', 'n_pubs': 'sum', 'n_citations': 'sum'})
        df_inst = df_inst.join(temp, [df_inst.id == temp.institute_id], 'leftouter')
        df_inst = df_inst.select('id', 'name', 'count(author_id)', 'sum(n_pubs)', 'sum(n_citations)').\
            withColumnRenamed('count(author_id)', 'n_members').\
            withColumnRenamed('sum(n_pubs)', 'n_pubs').\
            withColumnRenamed('sum(n_citations)', 'n_citations').\
            fillna(0)
        df_inst.toPandas().to_csv(f'{PATH_CSV_FINAL}/institute.csv', index=False)

    # Topic metrics
    elif opt == 'topic':
        df_arta = df_art.join(df_article, [df_article.id == df_art.article_id], 'leftouter').\
            select('article_id', 'topic_id', 'n_citations').\
            groupBy('topic_id').\
            agg({'article_id': 'count', 'n_citations': 'sum'}).\
            withColumnRenamed('count(article_id)', 'n_articles').\
            withColumnRenamed('sum(n_citations)', 'n_citations').\
            fillna(0)
        df_autg = df_aut.select('author_id', 'topic_id').groupBy('topic_id').count()
        df_topic = df_topic.join(df_autg, [df_autg.topic_id == df_topic.id], 'leftouter').\
            select('id', 'name', 'count').\
            withColumnRenamed('count', 'n_authors').\
            fillna(0)
        df_topic = df_topic.join(df_arta, [df_arta.topic_id == df_topic.id], 'leftouter').\
            select('id', 'name', 'n_articles', 'n_authors', 'n_citations').\
            fillna(0)
        df_topic.toPandas().to_csv(f'{PATH_CSV_FINAL}/topic.csv', index=False)

    # Venue metrics
    elif opt == 'venue':
        df_av = df_article.groupBy('venue_id').\
            agg({'id': 'count', 'n_citations': 'sum'})
        df_venue = df_venue.join(df_av, [df_venue.id == df_av.venue_id], 'leftouter').\
            select('id', 'name', 'acronym', 'type', 'count(id)', 'sum(n_citations)').\
            withColumnRenamed('count(id)', 'n_pubs').\
            withColumnRenamed('sum(n_citations)', 'n_citations').\
            fillna(0)
        # Flexibility: #articles published at venue with
        # at least 1 topic not present in the venue's list of topics / total articles published at venue
        df_avt = df_article.join(df_art, [df_art.article_id == df_article.id], 'inner').\
            withColumnRenamed('topic_id', 'article_topic_id').\
            withColumnRenamed('venue_id', 'article_venue_id').\
            select('id', 'article_venue_id', 'article_topic_id')
        df_avtt = df_avt.join(df_vt, [df_vt.venue_id == df_avt.article_venue_id, df_vt.topic_id == df_avt.article_topic_id], 'leftouter').\
            where('venue_id IS NULL AND topic_id IS NULL').\
            select('id', 'article_venue_id').\
            groupBy('article_venue_id').agg(F.countDistinct('id')).\
            withColumnRenamed('count(id)', 'n_oot') # out of topic
        df_venue = df_venue.join(df_avtt, [df_venue.id == df_avt.article_venue_id], 'leftouter').fillna(0).\
            withColumn('flexibility', F.col('n_oot') / F.col('n_pubs')).\
            select('id', 'name', 'acronym', 'type', 'n_pubs', 'n_citations', 'flexibility')
        df_venue.toPandas().to_csv(f'{PATH_CSV_FINAL}/venue.csv', index=False)

    # Author-topic metrics
    elif opt == 'author_topic':
        df_aut = df_aa.join(df_art, 'article_id', 'leftouter').\
            select('author_id', 'article_id', 'topic_id').\
            groupBy('author_id', 'topic_id').count().\
            withColumnRenamed('count', 'n_pubs')
        df_aut.toPandas().to_csv(f'{PATH_CSV_FINAL}/author_topic.csv', index=False)

    # Coauthor metrics
    elif opt == 'coauthor':
        df_coauthor = df_aa.withColumnRenamed('author_id', 'author_id_1').\
            join(df_aa.withColumnRenamed('author_id', 'author_id_2'), 'article_id', 'inner').\
            select('author_id_1', 'author_id_2').\
            where('author_id_1 < author_id_2').\
            groupBy('author_id_1', 'author_id_2').count().\
            withColumnRenamed('count', 'n_colab').\
            orderBy('author_id_1', 'author_id_2')
        df_coauthor.toPandas().to_csv(f'{PATH_CSV_FINAL}/coauthor.csv', index=False)

    # Stop
    spark.stop()
