load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data;
        var content = '';
        nextUrl = url;
        do {
            data = getChapterContent(nextUrl);
            nextUrl = data.nextUrl;
            content += data.htm + '\n';
        } while (data.nextUrl != null);

        return Response.success(convertT2S(content));
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function getChapterContent(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var htm = doc.select("#content");
        htm.select("div").remove();
        htm.select("script").remove();
        htm.select("a").remove();
        htm.select("h1").remove();

        htm = htm.html();
        htm = cleanHtml(htm)
            .replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');

        return {
            htm: htm,
            nextUrl: getMoreContentUrl(doc)
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

function getMoreContentUrl(doc) {
    var nextButton = null;

    doc.select('a').forEach(element => {
        if (element.text() == '下一页') {
            nextButton = element;
        }
    });

    if (!nextButton) return null;

    if (getBookId(nextButton.attr('href')).indexOf('_') != -1) return BASE_URL + nextButton.attr('href');

    return null;
}

function getBookId(url) {
    var regex = /\/(\d+(?:_\d+)?)\.html$/;
    var match = url.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }

    return null;
}