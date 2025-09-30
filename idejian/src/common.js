function toCapitalize(sentence) {
    var words = sentence.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.substring(1);
    }
    return words.join(" ");
}

function extractBookId(url, isSTV) {
    var match;
    if (isSTV) {
        match = url.match(/\/(\d+)\/?$/);
    } else {
        match = url.match(/\/(\d+)\.htm/);
    }
    if (!match) {
        throw new Error("Book ID not found in URL");
    }
    return match[1];
}

function text(doc, selector) {
    var el = $.Q(doc, selector);
    if (el && typeof el.text === 'function') {
        var t = el.text();
        if (typeof t === 'string') {
            return t.trim();
        }
    }
    return '';
}
