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
        var genres = DEFAULT_GENRES.find(p => p.title == genreName);
        var recommendBooks = [];
        (doc.select("#__layout > div > div:nth-child(2) > div > div.more_recommend > a") || []).forEach(e => {
            recommendBooks.push({
                name: e.text().convertT2S(),
                link: e.attr("href"),
                host: BASE_URL,
            })
        });

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#__layout > div > div:nth-child(2) > div > div.description > div > p").text().convertT2S(),
            detail: "Last chapter: " + doc.select("head > meta[name=og:novel:latest_chapter_name]").attr("content"),
            host: BASE_URL,
            ongoing: doc.select("head > meta[name=og:novel:status]").attr("content") == "連載",
            suggests: [
                {
                    title: "Recommend",
                    input: JSON.stringify(recommendBooks),
                    script: "recommend.js"
                }
            ],
            genres: [
                {
                    title: genreName || "全部分类",
                    input: genres != undefined ? genres.input : DEFAULT_GENRES[0].input,
                    script: "gen.js"
                },
                {
                    title: authorElm.text(),
                    input: authorElm.text(),
                    script: "search.js"
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