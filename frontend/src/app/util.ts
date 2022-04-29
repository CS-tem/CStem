function checkForSearchMatch(key: string, text: string) : Boolean {
    var s1 = key.toLowerCase();
    var s2 = text.toLowerCase();
    return s2.includes(s1);
}