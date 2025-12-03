load('libs.js');
load('config.js');
load('stv.js');

function execute(url) {
    try {
        var isSTV = url.indexOf("sangtacviet") !== -1 || url.indexOf("14.225.254.182") !== -1;
        var book_id = extractBookId(url, isSTV);

        var browser = Engine.newBrowser(); // Khởi tạo browser
        browser.launch(BASE_URL + '/book/' + book_id + '/', 5000);
        var doc = browser.html(); // Trả về Document object của trang web
        browser.close();

        var data = [];
        var elems = $.QA(doc, 'div.catalog > ul > li');

        if (!elems.length) return getTocSTV(url);

        var seenIds = {};
        for (var i = 0; i < elems.length; i++) {
            var e = $.Q(elems[i], "a:not(#bookcase)");
            var id = elems[i].attr('data-num');
            if (!seenIds[id] && $.QA(elems[i], "a:not(#bookcase)").length) { 
                data.push({
                    name: e.text().formatTocName(),
                    url: e.attr('href'),
                    host: BASE_URL,
                    id: id
                });
                seenIds[id] = true;
            }
        }

        // data = data.reverse();

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
