load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        var response;
        if (page == 1) {
            url = `${BASE_URL}/search.html`;

            var params = encodeFormData({
                searchkey: key,
                searchtype: "all",
            });

            response = crawler.post(url, params, {
                // "Cookie": "Hm_lpvt_3094b20ed277f38e8f9ac2b2b29d6263=1765269774;Hm_lpvt_c3da01855456ad902664af23cc3254cb=1765269774",
                "Cookie": "Hm_lpvt_3094b20ed277f38e8f9ac2b2b29d6263=9999999999;Hm_lpvt_c3da01855456ad902664af23cc3254cb=9999999999",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "text/html,application/xhtml+xml",
            });
        } else {
            url = BASE_URL + page;
            response = crawler.get(url);
        }

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