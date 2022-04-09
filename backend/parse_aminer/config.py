import os

PATH_BASE = os.path.dirname(os.path.dirname(__file__))
PATH_DATA = f'{PATH_BASE}/data/aminer'

ESSENTIAL_KEYS = (
    # 'abstract',
    'authors',
    'doi',
    # 'fos',
    '_id',
    # 'isbn',
    # 'issn',
    # 'issue',
    # 'keywords',
    # 'lang',
    'n_citation',
    # 'page_end',
    # 'page_start'
    # 'pdf',
    'references',
    'title',
    # 'url',
    'venue',
    # 'volume',
    'year'
)

VENUE_ID_MAP = [
    ('53a727c520f7420be8b9ba3d', 'European Conference on Computer Vision'),
    ('5390797220f770854f5bb95f', 'International Journal of Computer Vision'),
    ('53a7266b20f7420be8b75e74', 'International Conference on Computer Vision Theory and Applications'),
    ('53a72a0320f7420be8bed092', 'International Conference on Computer Vision Systems'),
    ('53a72d7620f7420be8c6646b', 'International Conference on Computer Vision'),
    ('54824c66582fc50b5e008eb0', 'Asian Conference on Computer Vision'),
]
