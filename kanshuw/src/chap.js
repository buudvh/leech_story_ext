load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var htm = doc.select(".content");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h1").remove();

        htm = htm.html();
        htm = htm.cleanHtml();
        htm = htm.replace(/<br\s*\/?>[^<]*?(?:天天看小說|看書就來)[^<]*?(?=<br\s*\/?>)/gi, '');
        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}