load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || "1";
        url = BASE_URL + url + page;
        var data = [];
        var response = crawler.get(url);
        
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".content dl");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            let link = e.select("dt:nth-child(2) > a").first().attr("href");
            data.push({
                name: e.select("dt:nth-child(2) > a").first().text().convertT2S(),
                link: link,
                cover: buildCover(getBookId(link)),
                description: '作者: ' + e.select('dd:nth-child(4) > a').first().text().convertT2S()
                    + "\n" + e.select("dd:nth-child(3)").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (e) {
        return Response.error(`Url: ${url} \nMessage: ${e.message}`);
    }
}