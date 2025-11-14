function getDetailSTV(url) {
    try {
        var isSTV = url.indexOf("sangtacviet") !== -1 || url.indexOf("14.225.254.182") !== -1;
        var bookid = extractBookId(url, isSTV);
        url = STVHOST + '/truyen/69shu/1/' + bookid + '/';
        var response = fetch(url);

        if (!response.ok) throw new Error('fail to fetch: status ' + response.status);

        var doc = response.html();

        var comments = [{
            title: "评论",
            input: bookid,
            script: "comment.js"
        }];

        var authorName = getAuhtorNameSTV(doc);
        var bookName = text(doc, '#oriname');
        var cover = 'https://static.69shuba.com/files/article/image/' + bookid.slice(0, bookid.length - 3) + '/' + bookid + '/' + bookid + 's.jpg';

        return Response.success({
            name: bookName,
            cover: cover,
            author: text(doc, 'h2'),
            description: $.QA(doc, '#book-sumary p', { m: function (x) { return x.text(); }, j: '<br>' }),
            detail: '【Thông tin lấy từ Sangtacviet】'
                + '<br>Bookid: ' + bookid
                + '<br>Source: 【' + (isSTV ? "STV" : "69shuba") + '】',
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: encodeAuthorUrl('https://www.69shuba.com/modules/article/author.php?author=' + authorName),
                    script: "author.js"
                },
                {
                    title: "Nguồn khác",
                    input: JSON.stringify({
                        name: bookName,
                        cover: cover,
                        url: isSTV ? (BASE_URL + '/book/' + bookid + '.html') : (STVHOST + "/truyen/69shu/1/" + bookid + "/"),
                        source: (isSTV ? "69shuba" : "STV"),
                    }),
                    script: "otherurl.js"
                },
            ],
            comments: comments,
        });
    } catch (error) {
        throw error;
    }
}

function getAuhtorNameSTV(doc) {
    var onclickAttr = doc.select("i.cap").first().attr("onclick");
    var match = onclickAttr.match(/findinname=([^']+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function getTocSTV(url) {
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

        if (!response.ok) throw new Error("Error try STV: status" + response.status);

        var objData = JSON.parse(response.text());

        if (objData.code != '1') throw new Error("Error try STV: x.code" + objData.code);

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
        throw error;
    }
}
