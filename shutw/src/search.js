load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = `${BASE_URL}/search/${key}/${page}.html`;
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var elms = doc.select("div.bookbox");

        if (!elms.length) {
            if (doc.select("head > meta[property=og:novel:book_name]")) {
                return Response.success([{
                    name: doc.select("div.booktitle").text().formatTocName(),
                    author: doc.select("div.bookinfo > p.booktag > a").text().convertT2S(),
                    cover: doc.select("div.bookcover.hidden-xs > img").attr("src"),
                    description: doc.select("div.bookinfo > p.bookintro").html().convertT2S(),
                    host: BASE_URL,
                }]);
            } else throw new Error("Length = 0");
        }

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div > div.bookinfo > div.bookname > a").first().text().convertT2S(),
                link: e.select("div > div.bookinfo > div.bookname > a").first().attr("href"),
                cover: DEFAULT_COVER,
                description: e.select("div.author").first().text().convertT2S()
                    + "\n" + e.select("div.cat").first().text().convertT2S(),
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