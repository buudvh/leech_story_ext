load('libs.js');
load('config.js');
load('common.js');

function execute(key, page) {
    try {
        page = page || '1';
        url = BASE_URL + "/search/";
        var data = [];

        var params = encodeFormData({
            searchkey: key,
            searchtype: "all",
            t_btnsearch: ""
        });

        var response = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".list-item");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: convertT2S(e.select(".article > a").first().text()),
                link: BASE_URL + e.select(".article > a").first().attr("href"),
                cover: e.select("img").first().attr("src") || DEFAULT_COVER,
                description: convertT2S(e.select("span.mr15").first().text())
                    + "\n" + convertT2S(e.select("span.fs12").first().text()),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (e) {
        Response.error(`fetch ${url} failed: ${e.message}`);
    }
}

function encodeFormData(data) {
    var pairs = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
    }
    return pairs.join("&");
}

function getAuthorName(text) {
    //作者:七年之期 閱讀:9 字數： 萬字
    const match = text.match(/^作者:(.+?)\s*閱讀:/);

    return (match ? match[1].trim() : null);
}