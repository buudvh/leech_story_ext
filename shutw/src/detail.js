load('libs.js');
load('config.js');

function execute(url) {
    try {
        var browser = Engine.newBrowser();
        browser.launch(url, 10000);
        var doc = browser.html();
        browser.close();

        var descriptionElm = doc.select("div.bookinfo > p.bookintro");
        descriptionElm.select('img').remove();

        return Response.success({
            name: doc.select("h1.booktitle").text().formatTocName(),
            author: doc.select("div.bookinfo > p.booktag > a").text().convertT2S(),
            cover: doc.select("div.bookcover.hidden-xs > img").attr("src"),
            description: descriptionElm.html().convertT2S(),
            detail: doc.select("div.bookinfo > p:nth-child(4)").text()
                + "\n" + doc.select("div.bookinfo > p.booktime").text(),
            host: BASE_URL,
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}