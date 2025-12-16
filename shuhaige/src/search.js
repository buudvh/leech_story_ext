load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        var response;
        if (page == 1) {
            url = getRedirectUrl(key);
        } else {
            url = BASE_URL + page;
        }

        response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var elms = doc.select("#sitembox dl");

        if (!elms.length) throw new Error(`Length = 0`);

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("dd:nth-child(2) h3 a").first().text(),
                link: e.select("dd:nth-child(2) h3 a").first().attr("href"),
                cover: e.select("dt a img").first().attr("src") || DEFAULT_COVER,
                description: e.select("dd:nth-child(3) span:nth-child(1)").first().text()
                    + "\n" + e.select("dd.book_des").first().text(),
                host: BASE_URL
            });
        });

        var nextElm = doc.select("#pagelink a").last();
        var next = nextElm ? nextElm.attr('href') : null;
        return next != page ? Response.success(data, next) : Response.success(data);
    } catch (error) {
        // return Response.error(`Url ${url} \nMessage: ${error.message}`);
        return Response.success([
            {
                name: `Url ${url} \nMessage: ${error.message}`,
                link: '',
                cover: DEFAULT_COVER,
                host: BASE_URL
            }
        ]);
    }
}

function getRedirectUrl(key) {
    var MAX_RETRY = 5
    var searchUrlRegex = /^https?:\/\/m\.shuhaige\.net\/search\/\d+\/\d+\.html$/;
    var url = "";
    var retry_cnt = 0;
    do {
        retry_cnt++;
        var browser = Engine.newBrowser();
        browser.launch(MOBILE_URL, 5000);

        var inputSelector = 'input[name="searchkey"]';
        var buttonSelector = 'button.layui-btn';

        browser.callJs(
            `
            var inputField = document.querySelector('${inputSelector}'); 
            var submitButton = document.querySelector('${buttonSelector}');

            if (inputField && submitButton) {
                inputField.value = '${key}';
                
                submitButton.click(); 
            }
            `,
            3000
        );

        // 3. Chờ URL chuyển hướng thành công (Ví dụ: /search/3221/1.html)
        browser.waitUrl('.*/search/.*', 10000);

        browser.callJs(
            `
            document.body.innerHTML += '<div id="url">' + location.href + '</div>';
            `,
            3000
        );

        var doc = browser.html();
        browser.close();
        url = doc.select("#url").text();
    } while (!searchUrlRegex.test(url) && retry_cnt <= MAX_RETRY);

    return url.replace(MOBILE_URL, BASE_URL);
}