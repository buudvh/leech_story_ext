load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var data = [];
        var response = crawler.get(url, {}, true);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#__layout > div > div.frame_body > div.pure-g > div.novel_cell");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select("h3").first().text().convertT2S(),
                link: e.select("a").first().attr("href"),
                cover: e.select("amp-img").first().attr("src") || DEFAULT_COVER,
                description: e.select("ul > li:nth-child(2)").first().text().convertT2S()
                    + "\n" + e.select("ul > li:nth-child(3)").first().text().replace('簡介：', '').convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}