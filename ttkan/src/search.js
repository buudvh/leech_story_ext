load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = `${BASE_URL}/novel/search?searchkey=${encodeURIComponent(key)}&searchtype=all&page=${page}`
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#__layout > div > div.frame_body > div.pure-g > div.novel_cell");

        if (!elms.length) {
            if (doc.select("head > meta[data-hid=og:novel:book_name]")) {
                return Response.success([{
                    name: doc.select("head > meta[data-hid=og:novel:book_name]").attr("content").convertT2S(),
                    link: doc.select("head > meta[data-hid=og:url]").attr("content"),
                    cover: doc.select("head > meta[data-hid=og:image]").attr("content"),
                    description: doc.select("head > meta[data-hid=og:novel:latest_chapter_name]").attr("content").convertT2S(),
                    host: BASE_URL
                }]);
            } else throw new Error("Length = 0");

        }

        var data = [];
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