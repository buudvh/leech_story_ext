load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('div.booknav2 > p:nth-child(2) > a');
        var genreElm = doc.select('div.booknav2 > p:nth-child(3) > a');

        return Response.success({
            name: convertT2S(text(doc, 'div.booknav2 > h1')),
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
            genres: [
                {
                    title: genreElm.text(),
                    input: BASE_URL + genreElm.attr("href"),
                    script: "gen2.js"
                }
            ],
            comments: [{
                title: "Reviews",
                input: doc.select('.review-list').html(),
                // input: url,
                script: "review.js"
            }],
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function getCoverUrl(url) {
    return url && url != 'https://twkan.com/modules/article/images/nocover.jpg' ? url : DEFAULT_COVER;
}