load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url, {
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span > span > a');
        var genreElm = doc.select("div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > span.typebut > a");
        var descriptionElm = doc.select('div.bodywidth > div:nth-child(7) > div')
        var genres = [];
        genreElm.forEach(function (e) {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        return Response.success({
            name: text(doc, 'div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span'),
            cover: doc.select("div.bodywidth > div:nth-child(4) > div:nth-child(2) > div.imgwidth.imgmargin > img").first().attr("src") || DEFAULT_COVER,
            author: authorElm.text(),
            description: cleanHtml(descriptionElm.html()),
            detail: text(doc, 'div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) > span > span'),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.attr("href"),
                    script: "gen.js"
                }
            ],
            genres: genres,
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function buildFinalUrl(bookid) {
    return BASE_URL + '/book/' + bookid + '.htm';
}

function buildGenres(doc) {
    var genres = [];

    var mainGenreEl = $.Q(doc, 'div.booknav2 > p:nth-child(3) > a');
    if (mainGenreEl && mainGenreEl.text()) {
        genres.push({
            title: mainGenreEl.text().trim(),
            input: mainGenreEl.attr("href"),
            script: "classify.js"
        });
    }

    var tagStr = doc.select("#div-book-infor") && doc.select("#div-book-infor").attr('tagsData') || '';
    var tags = tagStr.split("|");

    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        if (tag) {
            genres.push({
                title: tag,
                input: '/' + tag + '/{0}/',
                script: "gen2.js"
            });
        }
    }

    return genres;
}

function encodeAuthorUrl(url) {
    if (!url) return "";
    var baseUrl = "https://www.69shuba.com/modules/article/author.php?author=";
    var author = GBK.encode(url.replace(baseUrl, ""));
    return baseUrl + author;
}

function trySTV(url) {
    try {
        var isSTV = url.indexOf("sangtacviet") !== -1 || url.indexOf("14.225.254.182") !== -1;
        var bookid = extractBookId(url, isSTV);
        url = STVHOST + '/truyen/69shu/1/' + bookid + '/';
        var response = fetch(url);

        if (!response.ok) return Response.error('fail to fetch: status ' + response.status);

        var doc = response.html();

        var comments = [{
            title: "评论",
            input: bookid,
            script: "comment.js"
        }];

        var authorName = getAuhtorNameSTV(doc);

        return Response.success({
            name: text(doc, '#oriname'),
            cover: 'https://static.69shuba.com/files/article/image/' + bookid.slice(0, bookid.length - 3) + '/' + bookid + '/' + bookid + 's.jpg',
            author: text(doc, 'h2'),
            description: $.QA(doc, '#book-sumary p', { m: function (x) { return x.text(); }, j: '<br>' }),
            detail: 'GET FROM STV ID: ' + bookid,
            host: BASE_URL,
            suggests: [{
                title: "同作者",
                input: encodeAuthorUrl('https://www.69shuba.com/modules/article/author.php?author=' + authorName),
                script: "author.js"
            }],
            comments: comments
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
