load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var htm = doc.select(".page-content");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h3").remove();

        htm = htm.html();
        htm = htm.cleanHtml();
        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}