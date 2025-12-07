load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        return Response.success({
            name: doc.select('div.detail_bkname a').first().text(),
            cover: doc.select('div.info_bookimg a img').first().attr('src'),
            author: doc.select('div.detail_bkauthor').first().text(),
            description: doc.select('div.bk_brief div.brief_con').html().cleanHtml(),
            detail: `更新: ${doc.select('#next-chapter div div a').first().text()}`,
            host: BASE_URL,
            // suggests: [
            //     {
            //         title: "同作者",
            //         input: encodeAuthorUrl($.Q(doc, 'div.booknav2 > p:nth-child(2) > a') ? $.Q(doc, 'div.booknav2 > p:nth-child(2) > a').attr("href") : ''),
            //         script: "author.js"
            //     }
            // ],
            // genres: genres,
            // comments: [
            //     {
            //         title: "评论",
            //         input: bookid,
            //         script: "comment.js"
            //     },
            //     {
            //         title: "QQ Comments",
            //         input: bookName,
            //         script: "qqcomment.js"
            //     },
            // ]
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
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