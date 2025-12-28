load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > div.store > div.store_left > div > ul > li");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div.w100 > a > h2").first().text().convertT2S(),
                link: e.select("div.img_span > a").attr("href"),
                cover: e.select("div.img_span > a > img").first().attr("data-original") || DEFAULT_COVER,
                description: `${e.select("div.w100 > div > a > i").first().text().convertT2S()}|${e.select("div.w100 > div > div > em.blue").first().text().convertT2S()}`
                    + "\n" + e.select("div.w100 > p").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}