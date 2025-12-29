load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = `${BASE_URL}/search/${key}/${page}.html`;
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        // if (response.status == 302) return searchOnlyOneResult(url, key);

        var doc = response.html();
        var elms = doc.select("#article_list_content > li");

        if (!elms.length) return searchOnlyOneResult(url, key);

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div.newnav > h3 > a:nth-child(2)").first().text().convertT2S(),
                link: e.select("div.newnav > h3 > a:nth-child(2)").first().attr("href"),
                cover: e.select("a > img").first().attr("data-src") || DEFAULT_COVER,
                description: e.select("div.newnav > div.labelbox > label:nth-child(1)").first().text().convertT2S()
                    + "\n" + e.select("div.newnav > ol").first().text().convertT2S(),
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

function searchOnlyOneResult(url, key) {
    var MAX_RETRY = 5
    var retry_cnt = 0;
    var bookRegex = /\/book\/(\d+)\.html/;
    var redirectUrl = '';
    do {
        retry_cnt++;
        var browser = Engine.newBrowser();
        browser.launch(url, 5000);
        browser.waitUrl('.*/book/.*', 5000);

        browser.callJs(
            `
            document.body.innerHTML += '<div id="url">' + location.href + '</div>';
            `,
            500
        );

        var doc = browser.html();
        browser.close();
        redirectUrl = doc.select("#url").text();
    } while (!bookRegex.test(redirectUrl) && retry_cnt <= MAX_RETRY);

    return Response.success([{
        name: key,
        link: redirectUrl,
        cover: buildCover(getBookId(redirectUrl)),
        host: BASE_URL
    }]);;
}