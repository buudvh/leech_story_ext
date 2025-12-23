load('libs.js');
load('config.js');
load('common.js');

function execute(key, page) {
    try {
        page = page || '1';
        url = `${BASE_URL}/search/${page}?searchkey=${encodeURIComponent(key)}`;
        var data = [];

        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
            }
        });

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
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}