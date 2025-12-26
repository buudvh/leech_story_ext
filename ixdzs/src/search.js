load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = `${BASE_URL}/novel/search?searchkey=${encodeURIComponent(key)}&searchtype=all&page=${page}`
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#__layout > div > div.frame_body > div.pure-g > div.novel_cell");

        if (!elms.length) {
            url = retrySearch(url);
            response = crawler.get(url);
            if (!response.ok) throw new Error(`Status ${response.status} [Try]`);
            var doc = response.html();
            var bookName = doc.select('#__layout > div > div:nth-child(2) > div > div.pure-g.novel_info > div.pure-u-xl-5-6.pure-u-lg-5-6.pure-u-md-2-3.pure-u-1-2 > ul > li:nth-child(1) > h1').text();
            var cover = doc.select("#__layout > div > div:nth-child(2) > div > div.pure-g.novel_info > div.pure-u-xl-1-6.pure-u-lg-1-6.pure-u-md-1-3.pure-u-1-2 > a > amp-img").first().attr("src") || DEFAULT_COVER;
            return Response.success([{
                name: bookName.formatTocName(),
                link: url,
                cover: cover,
                description: doc.select("#__layout > div > div:nth-child(2) > div > div.description > div > p").text().convertT2S(),
                host: BASE_URL,
            }]);
        }

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("h3").first().text().convertT2S(),
                link: e.select("a").first().attr("href"),
                cover: e.select("amp-img").first().attr("src") || DEFAULT_COVER,
                description: e.select("ul > li:nth-child(2)").first().text().convertT2S()
                    + "\n" + e.select("ul > li:nth-child(3)").first().text().replace('簡介：', '').convertT2S(),
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

function retrySearch(url) {
    var MAX_RETRY = 5
    var url_redirect = "";
    var retry_cnt = 0;
    do {
        retry_cnt++;
        var browser = Engine.newBrowser();
        browser.launch(url, 5000);
        // 3. Chờ URL chuyển hướng thành công (Ví dụ: /novel/chapters/sheirangtaxiuxiande/index.html)
        browser.waitUrl('.*/novel/chapters/.*', 10000);

        browser.callJs(
            `
            document.body.innerHTML += '<div id="url">' + location.href + '</div>';
            `,
            3000
        );

        var doc = browser.html();
        browser.close();
        url_redirect = doc.select("#url").text();
    } while (!url_redirect.length && retry_cnt <= MAX_RETRY);

    return url_redirect;
}