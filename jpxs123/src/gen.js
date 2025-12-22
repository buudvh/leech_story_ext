load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        if (url.indexOf('index_1.html') != -1) url = url.replace('index_1.html', '');
        var data = [];
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html('gb2312');
        var elms = doc.select("body > div.content > div > div.books.m-cols > div.bk");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select(".infos h3").first().text().convertT2S(),
                link: e.select("a").first().attr("href"),
                cover: e.select("div.pic img").first().attr("src") || DEFAULT_COVER,
                description: e.select("div.infos div.booknews").first().text().convertT2S()
                    + "\n" + e.select("div.infos p").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}