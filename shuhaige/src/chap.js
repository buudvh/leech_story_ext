load('config.js');
load('libs.js');

function execute(url) {
    try {
        var htm = "";
        do {
            var content;
            [content, url] = getContentPaper(url);
            htm += content;
        } while (url != null);
        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}

function getNextContent(doc) {
    var nextElm = doc.select("#pager_next");
    if (nextElm && nextElm.text() == ">下一页") return nextElm.attr("href").mayBeFillHost(BASE_URL);
    return null;
}

function getContentPaper(url) {
    var response = crawler.get(url);
    if (!response.ok) throw new Error(`Status ${response.status}`)

    var doc = response.html();
    var htm = doc.select("#content");
    htm.select("div").remove();
    htm.select("a").remove();
    htm.select("h1").remove();

    htm = htm.html();
    htm = htm.replace(/<p[^>]*>[^<]*(?:下一页|shuhaige)[^<]*<\/p>/gi, '');
    htm = htm.cleanHtml();

    return [htm, getNextContent(doc)];
}
