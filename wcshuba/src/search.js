load('libs.js');
load('config.js');
load('common.js');

function execute(key, page) {
    try {
        page = page || '1';
        url = `${BASE_URL}/search/${page}?searchkey=${encodeURIComponent(key)}`;
        var data = [];

        // var response = crawler.get(url);

        // if (!response.ok) throw new Error(`Status ${response.status}`)
        var browser = Engine.newBrowser();
        browser.launch(url, 5000);
        // browser.waitUrl('.*/search/.*', 10000);
        var doc = browser.html();
        browser.close();

        var elms = doc.select(".content dl");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            let link = e.select("dt:nth-child(2) > a").first().attr("href");
            data.push({
                name: e.select("dt:nth-child(2) > a").first().text().convertT2S(),
                link: link,
                cover: buildCover(getBookId(link)),
                description: '作者: ' + e.select('dd:nth-child(4) > a').first().text().convertT2S()
                    + "\n" + e.select("dd:nth-child(3)").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}