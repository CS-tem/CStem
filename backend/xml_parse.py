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
split = {
    None: 0,
    'informal': 0,
    'withdrawn': 0,
    'data': 0,
    'software': 0,
    'survey': 0,
    'edited': 0,
    'informal withdrawn': 0,
    'encyclopedia': 0,
    'habil': 0,
    'noshow': 0,
    'disambiguation': 0,
    'group': 0
}
publ_stats = {
    'article': split.copy(),
    'inproceedings': split.copy(),
    'proceedings': split.copy(),
    'book': split.copy(),
    'incollection': split.copy(),
    'phdthesis': split.copy(),
    'mastersthesis': split.copy(),
    'www': split.copy()
}


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

    # for event, elem in context:
    #     if event == 'start':
    #         if elem.tag in publ_records:
    #             publ_stats[elem.tag][elem.attrib.get('publtype')] += 1
    #     if event == 'end':
    #         elem.clear()
    # print(publ_stats)
