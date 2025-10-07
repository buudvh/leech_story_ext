load('libs.js');
load('config.js');
load('common.js');

function execute(key, page) {
    var arrKey = key.split("&");
    if (!page) page = '1';
    var sort = '';
    if (arrKey.length == 2) {
        sort = arrKey[1];
    }

    var url = STVHOST + '/io/searchtp/searchBooks/?findinname=' + encodeURIComponent(arrKey[0]) +
        '&sort=' + sort + '&host=69shu&minc=0&tag=&p=' + page;

    if (key.indexOf("find=") === 0) {
        url = STVHOST + '/io/searchtp/searchBooks/?find=' + encodeURIComponent(arrKey[0].replace("find=", "")) +
            '&sort=' + sort + '&host=69shu&minc=0&tag=&p=' + page;
    }
    var response = fetch(url);

    if (!response.ok) return Response.error('fetch ' + url + ' failed: status ' + response.status);

    var doc = response.html();
    var next = (parseInt(page, 10) + 1).toString();
    var el = doc.select("a.booksearch");

    if (!el.length) return null;

    var data = [];
    el.forEach(function (e) {
        var stv_story_link = e.select("a").first().attr("href");
        var bookid = stv_story_link.split("/")[4];
        data.push({
            name: toCapitalize(e.select(".searchbooktitle").first().text()),
            link: STVHOST + "/truyen/69shu/1/" + bookid + "/",
            cover: 'https://static.69shuba.com/files/article/image/' +
                bookid.slice(0, bookid.length - 3) + '/' +
                bookid + '/' +
                bookid + 's.jpg',
            description: e.select("div > span.searchtag").last().text(),
            host: ""
        });
    });

    return Response.success(data, next);
}
