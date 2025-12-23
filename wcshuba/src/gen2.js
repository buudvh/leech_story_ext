load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var data = [];
        var response = crawler.get(url, {}, true);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#wrapper > main > div > div.rank.mt10.pc-only > div.left > ul > li");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            let link = e.select("a:nth-child(2)").first().attr("href");
            data.push({
                name: e.select("a:nth-child(2)").first().text().convertT2S(),
                link: link,
                cover: buildCover(getBookId(link)),
                description: `${e.select('span:nth-child(1)').first().text().convertT2S()}|作者: ${e.select('span:nth-child(4) a').first().text().convertT2S()}`
                    + `\n最后更新：${e.select("span:nth-child(5)").first().text().convertT2S()}`,
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}