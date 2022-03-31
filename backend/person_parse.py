from lxml import etree


def print_xml_tree(tree):
    """
    Prints the XML tree to the console.
    """
    print(etree.tostring(tree, pretty_print=True).decode('utf-8'))


if __name__ == '__main__':
    context = etree.iterparse('data/dblp.xml', events=('start', 'end'), load_dtd=True)

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
                    print_xml_tree(elem)
        if event == 'end':
            elem.clear()
        if count == 100:
            break
    print(count)
