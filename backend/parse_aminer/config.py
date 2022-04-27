import os

PATH_BASE = os.path.dirname(os.path.dirname(__file__))
PATH_DATA = f'{PATH_BASE}/data/aminer'

import re

# AMiner-Paper
id_pattern = re.compile('#index ([^\r\n]*)')
title_pattern = re.compile('#\* ([^\r\n]*)')
year_pattern = re.compile('#t ([0-9]*)')
venue_pattern = re.compile('#c ([^\r\n]*)')
refs_pattern = re.compile('#% ([^\r\n]*)')
