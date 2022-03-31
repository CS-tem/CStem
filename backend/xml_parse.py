from lxml import etree


publ_records = [
    # 'article',
    'inproceedings',
    # 'proceedings',
    # 'book',
    # 'incollection',
    # 'phdthesis',
    # 'mastersthesis',
    # 'www'
]

publtypes = [
    # None,
    'informal',
    'withdrawn',
    'data',
    'software',
    'survey',
    'edited',
    'informal withdrawn',
    'encyclopedia',
    'habil',
    'noshow',
    'disambiguation',
    'group'
]


def print_xml_tree(tree):
    """
    Prints the XML tree to the console.
    """
    print(etree.tostring(tree, pretty_print=True).decode('utf-8'))


if __name__ == '__main__':
    context = etree.iterparse("data/dblp.xml", events=('start', 'end'), load_dtd=True)

    count = 0
    for event, elem in context:
        if event == 'start':
            if elem.tag in publ_records:
                if elem.attrib.get('publtype') not in publtypes:
                    count += 1
                    if count % 1000 == 0:
                        print(count)
                    print(elem.attrib)
                    print(elem.xpath('string()'))
                    print(len(elem.getchildren()))
                    print_xml_tree(elem)
        if event == 'end':
            elem.clear()
        if count == 100:
            break
    print(count)
