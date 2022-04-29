import os

PATH_BASE = os.path.dirname(os.path.dirname(__file__))
PATH_DATA = f'{PATH_BASE}/data/aminer'

VENUE_ID_MAPPING = {
    'CVPR ': 0,
    'ECCV ': 1,
    'ICCV ': 2,
    'ICML ': 3,
    'KDD ': 4,
    'NIPS ': 5,
    'NIPS-3 ': 5,
    'Advances in Neural Information Processing Systems ': 5,
    'ACL ': 6,
    'EMNLP ': 7,
    'EMNLP-CoNLL': 7,
    'NAACL ': 8,
    'NAACL-': 8,
    'HLT ': 8,
    'HLT-': 8,
}
