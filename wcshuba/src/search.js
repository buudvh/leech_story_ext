load('libs.js');
load('config.js');
load('common.js');

function execute(key, page) {
    try {
        page = page || '1';
        url = page == '1' ?
            `${BASE_URL}/search/?searchkey=${encodeURIComponent(key)}`
            : `${BASE_URL}/search/${page}?searchkey=${encodeURIComponent(key)}`;
        var data = [];
        // var response = crawler.get(`https://read-web.onrender.com/api/proxy-wcshuba?key=${encodeURIComponent(key)}&page=${page}`);
        // var json_result = response.json();
        // doc = Html.parse(json_result.data);
        var response = fetch(url, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "vi,en-US;q=0.9,en;q=0.8,ja;q=0.7,zh-CN;q=0.6,zh;q=0.5",
            },
            "method": "GET",
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
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