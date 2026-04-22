load('config.js');
load('libs.js');

function execute(url) {
    try {
        var browser = Engine.newBrowser();
        browser.launch(url, 10000);
        var doc = browser.html();
        browser.close();
        var htm = doc.select("#txtcontent");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h1").remove();

        htm = htm.html();
        htm = htm.cleanHtml();
        htm = htm.replace(/<br\s*\/?>[^<]*?(?:101看书网|看書就來)[^<]*?(?=<br\s*\/?>)/gi, '');

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}