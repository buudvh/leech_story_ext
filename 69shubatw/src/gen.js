load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        if (page == "1") {
            url = BASE_URL + url;
        } else {
            url = BASE_URL + page;
        }
        var data = [];
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".list-item");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            var cover = e.select("img").first().attr("src") || DEFAULT_COVER
            if (cover.indexOf('//') == 0) cover = "http:" + cover;
            data.push({
                name: e.select(".article > a").first().text().convertT2S(),
                link: e.select(".article > a").first().attr("href"),
                cover: cover,
                description: e.select("body > table:nth-child(13) > tbody > tr > td:nth-child(2) > div > p > span").first().text().convertT2S()
                    + "\n" + e.select("span.fs12.gray").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = doc.select('body > div.index-container > a:nth-child(3)').attr("href");
        return next ? Response.success(data, next) : Response.success(data);
    } catch (error) {
        // return Response.error(`Url ${url} \nMessage: ${error.message}`);
        return Response.success([
            {
                name: error.message,
                link: '',
                description: url,
                cover: DEFAULT_COVER,
                host: BASE_URL
            }
        ]);
    }
}