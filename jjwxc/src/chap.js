load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html('gb18030');
        var htm = doc.select("body > div.grid-c > div.b.module > div:nth-child(2) > ul > li");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h3").remove();

        htm = htm.html();
        return Response.success(htm.cleanHtml());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}