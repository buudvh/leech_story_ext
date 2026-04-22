load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        //get bookid
        var browser = Engine.newBrowser();
        browser.launch(url, 10000);
        var docDetail = browser.html();
        var coverUrl = docDetail.select("div.bookcover.hidden-xs > img").attr("src");
        var bookid = getBookIdFromCover(coverUrl);

        url = `${BASE_URL}/book/${bookid}/ajax_index.html`
        browser.launch(url, 10000);
        var doc = browser.html();
        browser.close();
        var elms = doc.select("body > dd > a");
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

function getBookIdFromCover(url) {
    const match = url.match(/\/image\/\d+\/(\d+)\//);

    if (!match || match.length < 2) {
        throw new Error(`Url ${url} Can not get bookid`);
        
    }

    return match[1];
}