load('libs.js');
load('config.js');
load('gbk.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = `${BASE_URL}/modules/article/search.php?searchkey=${GBK.encode(key)}&searchtype=articlename&page=${page}`;
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html('gbk');
        var elms = doc.select("#nr");

        if (!elms.length) {
            if (doc.select("head > meta[name=og:novel:book_name]")) {
                var url = doc.select("head > meta[name=og:novel:latest_chapter_url]").attr("content").replace(/\/\d+\.html$/, "/index.html");
                return Response.success([{
                    name: doc.select("head > meta[name=og:novel:book_name]").attr("content").convertT2S(),
                    link: url,
                    cover: buildCover(getBookId(url)),
                    description: doc.select("head > meta[name=author]").attr("content").convertT2S()
                        + "\n" + doc.select("head > meta[name=og:novel:latest_chapter_name]").attr("content").convertT2S(),
                    host: BASE_URL
                }]);
            } else throw new Error("Length = 0");
        }

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("td:nth-child(1) > a").first().text().convertT2S(),
                link: e.select("td:nth-child(1) > a").first().attr("href"),
                cover: buildCover(getBookId(e.select("td:nth-child(1) > a").first().attr("href"))),
                description: e.select("td:nth-child(3)").first().text().convertT2S() + "|" + e.select("td:nth-child(5)").first().text().convertT2S()
                    + "\n" + e.select("td:nth-child(2) > a").first().text().convertT2S(),
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