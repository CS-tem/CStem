from lxml import etree


publ_records = [
    'article',
    'inproceedings',
    'proceedings',
    'book',
    'incollection',
    'phdthesis',
    'mastersthesis',
    'www'
]

publtypes = [
    None,
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

if __name__ == '__main__':
    context = etree.iterparse("data/dblp.xml", events=('start', 'end'), load_dtd=True)

    count = 0
    for event, elem in context:
        if event == 'start':
            if elem.tag in publ_records:
                if elem.attrib.get('publtype') not in publtypes:
                    count += 1
                    print(elem.attrib)
                    print(len(elem.getchildren()))
        if event == 'end':
            elem.clear()
        if count == 100:
            break
    print(count)
