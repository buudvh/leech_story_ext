load('libs.js');
load('config.js');
load('common.js');

//https://twkan.com/search/%E5%85%A8%E8%81%B7%E7%8D%B5%E4%BA%BA/1.html
function execute(key, page) {
    try {
        page = page || '1';
        url = BASE_URL + "/search/" + key + "/" + page + ".html";
        var data = [];

        // var params = encodeFormData({
        //     searchkey: key,
        //     searchtype: "all",
        //     t_btnsearch: ""
        // });

        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#article_list_content li");

        if(!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: convertT2S(e.select("h3").first().text()),
                link: e.select("a").first().attr("href"),
                cover: buildCoverUrl(e.select("a").first().attr("href")) || DEFAULT_COVER,
                description: convertT2S(e.select('.ellipsis_2').text()),
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
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