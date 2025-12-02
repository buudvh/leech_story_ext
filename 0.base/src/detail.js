load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('.novel_info_title i a').first();
        var genreElm = doc.select("div.novel_info_main > div > p:nth-child(3) > span:nth-child(1)");

        return Response.success({
            name: convertT2S(text(doc, 'h1')),
            cover: doc.select(".novel_info_main img").first().attr("src") || DEFAULT_COVER,
            author: convertT2S(authorElm.text()),
            description: convertT2S(cleanHtml(doc.select("#info div.intro").html())),
            detail: "更新：" + convertT2S(doc.select("div.novel_info_main > div > div.flex.to100 > .s_gray").text()),
            // suggests: [
            //     {
            //         title: 'Recommend',
            //         input: doc.select(".side_commend").html(),
            //         script: "recommend.js"
            //     }
            // ],
            genres: [
                {
                    title: genreElm.text(),
                    input: "",
                    script: "recommend.js"
                }
            ],
            comments: [{
                title: "Reviews",
                input: doc.select('.reviews').html(),
                // input: url,
                script: "reviews.js"
            }],
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}