load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        url = 'https://www.novels.com.tw/search/'
        var response = fetch("https://www.novels.com.tw/search/", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "vi,en-US;q=0.9,en;q=0.8,ja;q=0.7,zh-CN;q=0.6,zh;q=0.5",
                "content-type": "application/x-www-form-urlencoded",
            },
            "body": `searchkey=${encodeURIComponent(key)}&searchtype=all&Submit=`,
            "method": "POST",
        });

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > div.container > div > ul > li");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            var authorElm = e.select("div:nth-child(2) > p:nth-child(2)");
            authorElm.select("span").remove();
            authorElm.select("i").remove();
            data.push({
                name: e.select("div:nth-child(2) > a > h3").first().text().convertT2S(),
                link: e.select("div:nth-child(2) > a").attr("href"),
                cover: e.select("div.img_span > a > img").first().attr("data-original") || DEFAULT_COVER,
                description: authorElm.text().convertT2S()
                    + "\n" + e.select("div:nth-child(2) > p.searchresult_p").first().text().convertT2S(),
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