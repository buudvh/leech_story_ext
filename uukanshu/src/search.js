load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        if (!loginSearch(key)) throw new Error(`Can not login search`);

        page = page || '1';

        //https://uukanshu.cc/search/%E6%AD%A6%E9%81%93/1.html
        url = "https://uukanshu.cc/search/" + encodeURIComponent(key) + "/" + page + ".html";
        var response = fetch(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var data = [];
        var elems = doc.select('div.bookbox');

        if (!elems.length) throw new Error(`Length = 0`);

        elems.forEach(function (e) {
            var booklink = e.select("div.bookname a").first().attr('href');
            var bookid = getBookId(booklink);
            data.push({
                name: convertT2S(e.select("div.bookname").text()),
                link: e.select("div.bookname a").first().attr('href'),
                //https://image.uukanshu.cc/25/25950/25950s.jpg
                cover: bookid ? createCoverImgFromBookid(bookid) : DEFAULT_COVER,
                description: convertT2S(e.select("div.author").first().text()
                    + "\n" + e.select("div.update").text().replace('簡介：', '')),
            })
        });

        var next_page = parseInt(page) + 1;
        return Response.success(data, next_page.toString());
    } catch (e) {
        return Response.error(`fetch ${url} \nfailed: ${e.message}`);
        // return Response.success([{
        //     name: e.message,
        //     link: "",
        //     cover: DEFAULT_COVER,
        //     description: "",
        // }]);
    }
}

function loginSearch(key) {
    var url = "https://uukanshu.cc/search";

    var params = encodeFormData({
        searchtype: "all",
        searchkey: key,
        action: "login",
        submit: ""
    });

    var response = fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
        },
        body: params
    });

    return response.ok;
}