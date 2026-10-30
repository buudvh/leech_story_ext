load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        // POST này hay bị Cloudflare chặn (403); trang search GET vẫn chạy nên không dừng ở đây.
        loginSearch(key);

        page = page || '1';

        //https://uukanshu.cc/search/%E6%AD%A6%E9%81%93/1.html
        url = "https://uukanshu.cc/search/" + encodeURIComponent(key) + "/" + page + ".html";
        var response = fetch(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var data = [];
        var elems = doc.select('div.bookbox');

        // Trùng đúng tên truyện thì trang search chuyển thẳng tới trang truyện.
        if (!elems.length && doc.select("meta[property=og:novel:read_url]").length) {
            var readUrl = doc.select("meta[property=og:novel:read_url]").attr("content");
            if (page !== '1') return Response.success([]);
            return Response.success([{
                name: convertT2S(doc.select("meta[property=og:novel:book_name]").attr("content")),
                link: readUrl,
                cover: doc.select("meta[property=og:image]").attr("content") || DEFAULT_COVER,
                description: convertT2S(doc.select("meta[property=og:novel:author]").attr("content")
                    + "\n" + doc.select("meta[property=og:novel:latest_chapter_name]").attr("content")),
            }]);
        }

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

    try {
        var response = fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'text/html; charset=UTF-8',
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
            },
            body: params
        });
        return response.ok;
    } catch (e) {
        return false;
    }
}