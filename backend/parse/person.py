from lxml import etree

import config
import utils


def samplePerson(context, output_file, n_samples=-1):

    with open(output_file, 'w+') as f:

        f.write('<?xml version="1.0" encoding="ISO-8859-1"?>\n')
        f.write('<!DOCTYPE dblp SYSTEM "dblp.dtd">\n\n')
        f.write('<dblp>\n\n')

        count = 0
        for event, elem in context:
            if event == 'end':
                if elem.tag == 'www' and 'homepages' in elem.attrib.get('key'):
                    f.write(etree.tostring(elem, pretty_print=True).decode('utf-8'))
                    f.write('\n')
                    count += 1
                    if count == n_samples:
                        break
                elem.clear()

        f.write('\n</dblp>\n')

    return count


if __name__ == '__main__':

    context = etree.iterparse(f'{config.PATH_DATA}/dblp.xml', events=('end',), load_dtd=True)

    count = samplePerson(context, f'{config.PATH_DATA}/person.xml', -1)
    print(count)
    exit(0)

    count = 0
    for event, elem in context:
        if event == 'start':
            if elem.tag in ['www']:
                if 'homepages' in elem.attrib.get('key'):
                    count += 1
                    if count % 1000 == 0:
                        print(count)
                    print(elem.attrib)
                    # print(elem.xpath('string()'))
                    print(len(elem.getchildren()))
                    utils.printET(elem)
        if event == 'end':
            elem.clear()
        if count == 100:
            break
    print(count)
