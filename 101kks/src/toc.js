load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var browser = Engine.newBrowser();
        browser.launch(url, 10000);
        var doc = browser.html();
        browser.close();
        var elms = doc.select("body > ul > li > a");
        if (!elms.length) throw new Error("Length = 0");
        elms.forEach(e => {
            data.push({
                name: e.text().formatTocName(),
                url: e.attr("href"),
                host: BASE_URL,
            });
        });
        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
        // return Response.success([{
        //     name: error.message,
        //     url: '',
        //     host: BASE_URL,
        // }]);
    }
}