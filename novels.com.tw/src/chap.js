load('config.js');
load('libs.js');

function execute(url) {
    try {
        let [htm, doc] = getContent(url);

        doc.select('#pageselect option').forEach((e, index) => {
            if (index == 0) return;

            url = BASE_URL + e.attr("value");
            htm += getContent(url)[0];
        });
        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}

function getContent(url) {
    var browser = Engine.newBrowser();
    browser.launch(url, 5000);
    var doc = browser.html();
    browser.close();
    var htm = doc.select("#article");
    htm.select("div").remove();
    htm.select("a").remove();
    htm.select("h3").remove();

    htm = htm.html();
    return [htm.cleanHtml(), doc];
}