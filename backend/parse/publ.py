import utils
from config import *
from lxml import etree

def sample_inproceedings(context, output_file, max=-1):
    with open(output_file, 'w') as f:
        f.write('<?xml version="1.0" encoding="ISO-8859-1"?>')
        f.write('<!DOCTYPE dblp SYSTEM "dblp.dtd">')
        f.write('<dblp>')
        count = 0
        for event, elem in context:
            if event == 'end':
                if elem.tag == 'inproceedings' and elem.attrib.get('publtype') is None:
                    f.write(etree.tostring(elem, pretty_print=True).decode('utf-8'))
                    count += 1
                    if count == max:
                        break
                elem.clear()
        f.write('</dblp>')


if __name__ == '__main__':
    context = etree.iterparse(f'{PATH_DATA}/dblp.xml', events=('start', 'end'), load_dtd=True)

    sample_inproceedings(context, f'{PATH_DATA}/inproceedings.xml')
    exit(0)

    count = 0
    for event, elem in context:
        if event == 'start':
            if elem.tag in publ_records:
                if elem.attrib.get('publtype') in publtypes:
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

    # for event, elem in context:
    #     if event == 'start':
    #         if elem.tag in publ_records:
    #             publ_stats[elem.tag][elem.attrib.get('publtype')] += 1
    #     if event == 'end':
    #         elem.clear()
    # print(publ_stats)
