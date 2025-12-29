load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        url = BASE_URL + url;
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > div.container > div");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div > h3 > a").first().text().convertT2S(),
                link: e.select("div > h3 > a").first().attr("href"),
                cover: e.select("a > img").first().attr("src") || DEFAULT_COVER,
                description: e.select("div > p:nth-child(3) > a").first().text().convertT2S()
                    + "\n" + e.select("div:nth-child(2) > div > ul > li:nth-child(1) > a").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}