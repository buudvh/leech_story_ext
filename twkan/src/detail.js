load('libs.js');
load('config.js');

function execute(url) {
    try {
        // var response = fetch(url);
        // if (!response.ok) throw new Error(`Status ${response.status}`)

        // var doc = response.html();
        var browser = Engine.newBrowser(); // Khởi tạo browser
        browser.launch(url, 5000); // Mở trang web với timeout

        browser.callJs(
            "var div = document.createElement('div');" +
            "div.id = 'div-book-infor';" +
            "div.setAttribute('tagsData', (typeof bookinfo !== 'undefined' && bookinfo && bookinfo.tags) ? bookinfo.tags : '');" +
            "document.body.appendChild(div);",
            100
        );

        var doc = browser.html();
        browser.close();

        var authorElm = doc.select('div.booknav2 > p:nth-child(2) > a');
        var genreElm = doc.select('div.booknav2 > p:nth-child(3) > a');

        var genres = [{
            title: genreElm.text(),
            input: BASE_URL + genreElm.attr("href"),
            script: "gen2.js"
        }];
        genres = genres.concat(buildGenres(doc));

        var bookName = convertT2S(text(doc, 'div.booknav2 > h1'));

        return Response.success({
            name: bookName,
            cover: getCoverUrl(doc.select(".bookimg2 img").first().attr("src")),
            author: convertT2S(authorElm.text()),
            description: convertT2S(cleanHtml(doc.select("#tab_info > div").html())),
            detail: convertT2S(text(doc, 'div.booknav2 > p:nth-child(5)')),
            host: BASE_URL,
            // suggests: [
            //     {
            //         title: "同作者",
            //         input: authorElm.attr("href"),
            //         script: "author.js"
            //     }
            // ],
            genres: genres,
            comments: [
                {
                    title: "Reviews",
                    input: doc.select('.review-list').html(),
                    script: "review.js"
                },
                {
                    title: "QQ Comments",
                    input: bookName,
                    script: "qqcomment.js"
                },
            ],
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function getCoverUrl(url) {
    return url && url != 'https://twkan.com/modules/article/images/nocover.jpg' ? url : DEFAULT_COVER;
}

function buildGenres(doc) {
    var genres = [];

    var tagStr = doc.select("#div-book-infor") && doc.select("#div-book-infor").attr('tagsData') || '';
    var tags = tagStr.split(",");

    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        if (tag) {
            genres.push({
                title: convertT2S(tag),
                input: BASE_URL + '/newtag/' + encodeURIComponent(tag),
                script: 'tag.js'
            });
        }
    }

    return genres;
}