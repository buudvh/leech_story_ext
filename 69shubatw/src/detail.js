load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(2) > a');
        var genreElm = doc.select("div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(3) > a");

        return Response.success({
            name: convertT2S(text(doc, 'div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(1) > strong')),
            cover: doc.select(".bookinfo img").first().attr("src") || DEFAULT_COVER,
            author: authorElm.text(),
            description: convertT2S(doc.select("div.intro").text()),
            detail: convertT2S($.QA(doc, 'div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p', { m: function (x) { return x.text(); }, j: '<br>' })),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.attr("href"),
                    script: "author.js"
                }
            ],
            genres: [
                {
                    title: genreElm.text(),
                    input: genreElm.attr("href"),
                    script: "gen2.js"
                }
            ],
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
