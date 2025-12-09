load('libs.js');
load('config.js');

function execute(key, page) {
    try {
        page = page || '1';
        url = `${BASE_URL}/search/${page}?searchkey=${encodeURIComponent(key)}`
        var data = [];

        // var params = encodeFormData({
        //     searchkey: key,
        //     searchtype: "all",
        //     t_btnsearch: ""
        // });

        var response = crawler.get(url, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".list-item");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            var cover = e.select("img").first().attr("src") || DEFAULT_COVER;
            if (cover.indexOf('//') == 0) cover = "http:" + cover;

            data.push({
                name: e.select(".article > a").first().text().convertT2S(),
                link: e.select(".article > a").first().attr("href"),
                cover: cover,
                description: e.select("span.mr15").first().text().convertT2S()
                    + "\n" + e.select("span.fs12.gray").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}

// function encodeFormData(data) {
//     var pairs = [];
//     for (var key in data) {
//         if (data.hasOwnProperty(key)) {
//             pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
//         }
//     }
//     return pairs.join("&");
// }

function getAuthorName(text) {
    //作者:七年之期 閱讀:9 字數： 萬字
    const match = text.match(/^作者:(.+?)\s*閱讀:/);

    return (match ? match[1].trim() : null);
}