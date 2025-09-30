load('libs.js');
load('config.js');
load('common.js');

function execute(key, page) {
    try {
        var arrKey = key.split("&");
        if (!page) page = '1';
        var sort = '';
        if (arrKey.length === 2) {
            sort = arrKey[1];
        }

        var url = STVHOST + '/io/searchtp/searchBooks/?findinname=' + encodeURIComponent(arrKey[0]) +
            '&sort=' + sort + '&host=idejian&minc=0&tag=&p=' + page;

        if (key.indexOf("find=") === 0) {
            url = STVHOST + '/io/searchtp/searchBooks/?find=' + encodeURIComponent(arrKey[0].replace("find=", "")) +
                '&sort=' + sort + '&host=idejian&minc=0&tag=&p=' + page;
        }

        var response = fetch(url);
        if (!response.ok) {
            return Response.error('fetch ' + url + ' failed: status ' + response.status);
        }

        var doc = response.html();
        var next = (parseInt(page, 10) + 1).toString();
        var el = doc.select("a.booksearch");

        if (!el.length) return null;

        var data = [];
        el.forEach(function (e) {
            var stv_story_link = e.select("a").first().attr("href") || "";
            var parts = stv_story_link.split("/");
            var bookid = parts.length > 4 ? parts[4] : "";

            data.push({
                name: toCapitalize(e.select(".searchbooktitle").first().text()),
                link: BASE_URL + '/book/' + bookid + '/',
                cover: e.select("a:nth-child(1) > img").attr("src") || DEFAULT_COVER,
                description: e.select("div > span.searchtag").last().text(),
                host: BASE_URL
            });
        });

        return Response.success(data, next);
    } catch (error) {
        return Response.error(error.message);
    }
}


// function execute(key, page) {
//     let response = fetch(BASE_URL + '/search?keyword=' + key);

//     if (response.ok) {
//         let doc = response.html();
//         const data = [];
//         doc.select(".rank_ullist li").forEach(e => {
//             data.push({
//                 cover:e.select("img").first().attr("src"),
//                 name: e.select(".rank_bkname a").first().text(),
//                 link: BASE_URL + e.select(".rank_bkname a").first().attr("href"),
//                 description: e.select(".author").first().text(),
//                 host: BASE_URL
//             })
//         });
//         var next = (parseInt(page) + 1).toString();
//         return Response.success(data, next)
//     }
//     return null;
// }