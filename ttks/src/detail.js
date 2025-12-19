load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('#__layout > div > div:nth-child(2) > div > div.pure-g.novel_info > div.pure-u-xl-5-6.pure-u-lg-5-6.pure-u-md-2-3.pure-u-1-2 > ul > li:nth-child(2) > a');
        var bookName = doc.select('#__layout > div > div:nth-child(2) > div > div.pure-g.novel_info > div.pure-u-xl-5-6.pure-u-lg-5-6.pure-u-md-2-3.pure-u-1-2 > ul > li:nth-child(1) > h1').text();
        var cover = doc.select("#__layout > div > div:nth-child(2) > div > div.pure-g.novel_info > div.pure-u-xl-1-6.pure-u-lg-1-6.pure-u-md-1-3.pure-u-1-2 > a > amp-img").first().attr("src") || DEFAULT_COVER;
        var genreName = doc.select('#__layout > div > div:nth-child(2) > div > div.pure-g.novel_info > div.pure-u-xl-5-6.pure-u-lg-5-6.pure-u-md-2-3.pure-u-1-2 > ul > li:nth-child(3)').text().trim().replace('類別：', '');
        var genres = DEFAULT_GENRES.find(p => genreName.indexOf(p.title) != -1);

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#__layout > div > div:nth-child(2) > div > div.description > div > p").text().convertT2S(),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.text(),
                    script: "search.js"
                }
            ],
            genres: [
                {
                    title: genreName || "全部分类",
                    input: genres != undefined ? genres.input : DEFAULT_GENRES[0].input,
                    script: "gen.js"
                }
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName.convertT2S(),
                    script: "comment.js"
                }
            ]
        });
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}