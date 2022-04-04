from lxml import etree

from config import PATH_DATA, PUBL_RECORDS, PUBL_TYPES, PUBL_STATS
from utils import printET


def sampleInproceedings(context, output_file, n_samples=-1):

    with open(output_file, 'w+') as f:

        f.write('<?xml version="1.0" encoding="ISO-8859-1"?>\n')
        f.write('<!DOCTYPE dblp SYSTEM "dblp.dtd">\n\n')
        f.write('<dblp>\n\n')

        count = 0
        for event, elem in context:
            if event == 'start':
                if elem.tag == 'inproceedings' and elem.attrib.get('publtype') is None:
                    f.write(etree.tostring(elem, pretty_print=True).decode('utf-8'))
                    f.write('\n')
                    count += 1
                    if count == n_samples:
                        break
            if event == 'end':
                elem.clear()

        f.write('\n</dblp>\n')

    return count


if __name__ == '__main__':

    context = etree.iterparse(f'{PATH_DATA}/dblp.xml',
                              events=('start', 'end'), load_dtd=True)

    count = sampleInproceedings(context, f'{PATH_DATA}/inproceedings.xml', -1)
    print(count)
    exit(0)

    count = 0
    for event, elem in context:
        if event == 'start':
            if elem.tag in PUBL_RECORDS:
                if elem.attrib.get('publtype') in PUBL_TYPES:
                    count += 1
                    if count % 1000 == 0:
                        print(count)
                    print(elem.attrib)
                    print(len(elem.getchildren()))
                    printET(elem)
        if event == 'end':
            elem.clear()
        if count == 100:
            break
    print(count)
    exit(0)

    for event, elem in context:
        if event == 'start':
            if elem.tag in PUBL_RECORDS:
                PUBL_STATS[elem.tag][elem.attrib.get('publtype')] += 1
        if event == 'end':
            elem.clear()
    print(PUBL_STATS)
