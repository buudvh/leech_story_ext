load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html('gbk');
        var elms = doc.select("#sitebox dl");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(e => {
            data.push({
                name: e.select(".book_title h3 a").first().text().convertT2S(),
                link: e.select(".book_title h3 a").first().attr("href"),
                cover: e.select("img").first().attr("src") || DEFAULT_COVER,
                description: e.select("dd:nth-child(3) > span:nth-child(1)").first().text().convertT2S()
                    + "\n" + e.select("dd.book_des").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}