from lxml import etree

def printET(tree):
    """
    Prints the XML tree to the console.
    """
    print(etree.tostring(tree, pretty_print = True).decode('utf-8'))