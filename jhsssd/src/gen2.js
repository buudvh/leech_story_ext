load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(MOBILE_URL + url, page);
        var response = crawler.get(url, {}, true);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var elms = doc.select("#list > ul");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(e => {
            // var titleElm = e.select('li.tjxs > span:nth-child(1)');
            // titleElm.select('a').remove();
            data.push({
                name: e.select("li.tjxs > span:nth-child(1) > a").first().text().convertT2S(),
                link: e.select("li.tjxs > span:nth-child(1) > a").first().attr("href"),
                cover: e.select("li.tjimg > a > img").first().attr("src") || DEFAULT_COVER,
                description: e.select("li.tjxs > span:nth-child(2)").first().text().convertT2S(),
                host: MOBILE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}