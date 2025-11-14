load('libs.js');
load('config.js');

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

        if (!elems.length) return trySTV(url);

        var seenIds = {};
        for (var i = 0; i < elems.length; i++) {
            var e = $.Q(elems[i], "a:not(#bookcase)");
            var id = elems[i].attr('data-num');
            if (!seenIds[id] && $.QA(elems[i], "a:not(#bookcase)").length) { 
                data.push({
                    name: formatName(e.text()),
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
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function trySTV(url) {
    try {
        var result = [];
        var isSTV = url.indexOf("sangtacviet") !== -1 || url.indexOf("14.225.254.182") !== -1;
        var book_id = extractBookId(url, isSTV);

        tryUrl = STVHOST + '/index.php?ngmar=chapterlist&h=69shu&bookid=' + book_id + '&sajax=getchapterlist';

        var response = fetch(tryUrl, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Referer': STVHOST + "/truyen/69shu/1/" + book_id,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) return Response.error("Error try STV: status" + response.status);

        var objData = JSON.parse(response.text());

        if (objData.code != '1') return Response.error("Error try STV: x.code" + objData.code);

        var chapters = objData.data.split("-//-");

        for (var i = 0; i < chapters.length; i++) {
            var parts = chapters[i].split("-/-");
            var chapterId = parts[1];
            var chapterName = parts[2];

            result.push({
                name: chapterName.trim().replace(/([\t\n]+|<br>| )/g, "").replace(/([\t\n]+|<br>|&nbsp;)/g, "").replace(/Thứ ([\d\,]+) chương/, "Chương $1:"),
                url: BASE_URL + '/txt/' + book_id + '/' + chapterId,
                host: "",
                id: chapterId
            });
        }

        return Response.success(result);
    } catch (error) {
        return Response.error("Error try STV: " + error.message);
    }
}
