from lxml import etree


if __name__ == '__main__':
    context = etree.iterparse("data/dblp.xml", events=('start', 'end'), load_dtd=True)
    for event, elem in context:
        if event == 'start':
            print(elem.tag)
        if event == 'end':
            elem.clear()
