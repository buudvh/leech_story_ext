load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        url = `${BASE_URL}${url}`;
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > main > div.panel > ul > li.burl");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div.l-text > div > h3 > a").first().text().convertT2S(),
                link: e.attr("data-url"),
                cover: e.select("div.l-img > a > img").first().attr("src") || DEFAULT_COVER,
                description: `${e.select("div.l-text > div > p.l-p1 > span.bauthor > a").first().text().convertT2S()}|${e.select("div.l-text > div > p.l-last > span.l-time").first().text().convertT2S()}`
                    + "\n" + e.select("div.l-text > div > p.l-p2").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}