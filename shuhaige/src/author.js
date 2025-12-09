load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = BASE_URL + url;
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var elms = doc.select("#sitembox dl");

        if (!elms.length) throw new Error(`Length = 0`);

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("dd:nth-child(2) h3 a").first().text(),
                link: e.select("dd:nth-child(2) h3 a").first().attr("href"),
                cover: e.select("dt a img").first().attr("src") || DEFAULT_COVER,
                description: e.select("dd:nth-child(3) span:nth-child(1)").first().text()
                    + "\n" + e.select("dd.book_des").first().text(),
                host: BASE_URL
            });
        });

        return Response.success(data);
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