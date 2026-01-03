load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = `${MOBILE_URL}/search.html?ie=utf-8&word=${encodeURIComponent(key)}&page=${page}`;
        var response = crawler.get(url, {}, true);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var elms = doc.select(".searchbook");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div.bookinfo > h4 > a").first().text().convertT2S(),
                link: e.select("div.bookinfo > h4 > a").first().attr("href"),
                cover: e.select("div.bookimg > a > img").first().attr("src"),
                description: e.select(".author").first().text().convertT2S()
                    + "\n" + e.select(".update").first().text().convertT2S(),
                host: MOBILE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
        // return Response.success([
        //     {
        //         name: `Url ${url} \nMessage: ${error.message}`,
        //         link: '',
        //         cover: DEFAULT_COVER,
        //         host: BASE_URL
        //     }
        // ]);
    }
}