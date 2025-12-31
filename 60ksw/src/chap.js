load('config.js');
load('libs.js');

function execute(url) {
    try {
        // var response = crawler.get(url);
        // if (!response.ok) throw new Error(`Status ${response.status}`)

        // var doc = response.html('gbk');
        // var htm = doc.select("#content");
        // htm.select("div").remove();
        // htm.select("a").remove();
        // htm.select("h1").remove();

        // htm = htm.html();
        // htm = htm.cleanHtml();

        // return Response.success(htm);
        url = String.format(BASE_URL + "/bookstore/quanbu/default-0-0-0-0-0-0-{0}.html", "1");
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html('gbk');

        return Response.success(doc.select("#sitebox").html());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}