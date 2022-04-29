import os

PATH_BASE = os.path.dirname(os.path.dirname(__file__))
PATH_DATA = f'{PATH_BASE}/data/aminer'

VENUE_ID_MAPPING = {
    'CVPR ': 0,
    'ECCV ': 1,
    'ICCV ': 2,
    'ICML ': 3,
    # 'KDD ': 4,
    # 'NIPS ': 5,
    # 'NIPS-3 ': 5,
    # 'Advances in Neural Information Processing Systems ': 5,
    'ACL ': 6,
    # 'EMNLP ': 7,
    # 'EMNLP-CoNLL': 7,
    # 'NAACL ': 8,
    # 'NAACL-': 8,
    # 'HLT ': 8,
    # 'HLT-': 8,
}

CON_COUNTRIES_FILE = f'{PATH_DATA}/constant/countries.csv'
CON_INSTITUTIONS_FILE = f'{PATH_DATA}/constant/institutions.csv'
CON_TOPIC_FILE = f'{PATH_DATA}/constant/topic.csv'
CON_VENUE_TOPICS_FILE = f'{PATH_DATA}/constant/venue_topic.csv'
CON_VENUE_FILE = f'{PATH_DATA}/constant/venue.csv'

S0_ARTICLE_TOPIC_FILE = f'{PATH_DATA}/s0/article_topic.csv'
S0_ARTICLE_FILE = f'{PATH_DATA}/s0/article.csv'
S0_COUNTRY_FILE = f'{PATH_DATA}/s0/country.csv'
S0_INSTITUTE_COUNTRY_FILE = f'{PATH_DATA}/s0/institute_country.csv'
S0_INSTITUTE_FILE = f'{PATH_DATA}/s0/institute.csv'

S1_AUTHOR_ARTICLE_FILE = f'{PATH_DATA}/s1/author_article.csv'
S1_AUTHOR_ID_FILE = f'{PATH_DATA}/s1/author_id.csv'
S1_CITED_BY_FILE = f'{PATH_DATA}/s1/cited_by.csv'

S2_AUTHOR_COUNTRY_FILE = f'{PATH_DATA}/s2/author_country.csv'
S2_AUTHOR_FILE = f'{PATH_DATA}/s2/author.csv'
S2_INSTITUTE_MEMBER_FILE = f'{PATH_DATA}/s2/institute_member.csv'
