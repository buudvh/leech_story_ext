load('libs.js');

function execute(url) {
    try {
        let content = '';
        let currentUrl = url;

        do {
            const data = getChapterContent(currentUrl);
            content += data.htm + '\n';
            currentUrl = data.nextUrl;
        } while (currentUrl);

        return Response.success(content.convertT2S());
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
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
        htm = htm.cleanHtml()
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
    var nextButton = doc.select('a').toArray().find(el => el.text() === '下一页');

    if (!nextButton) return null;

    const href = nextButton.attr('href');
    const bookId = getBookId(href);

    if (bookId && bookId.includes('_')) {
        return BASE_URL + href;
    }

    return null;
}

function getBookId(url) {
    const match = url.match(/\/(\d+(?:_\d+)?)\.html$/);
    return match ? match[1] : null;
}