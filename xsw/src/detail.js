load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(/https?:\/\/m\.xsw\.tw\/(\d+)\/?/, `${BASE_URL}/book/$1.html`);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`)

        var doc = response.html();

        var authorElm = doc.select('#detail-box > div > div.ui_bg6 > div.box_intro > div.box_info > table > tbody > tr:nth-child(1) > td > div:nth-child(1) > h1 > em').first();
        var bookName = doc.select('body > div.layout > div.bread-crumb-nav.fn-clear > ul > li:nth-child(3) > a').text();
        var cover = doc.select("#detail-box > div > div.ui_bg6 > div.box_intro > div.pic > img").first().attr("src");
        var genreElm = doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > h3 > div > a:nth-child(2)').first();
        var objGen = DEFAULT_GEN.find(p => p.title == genreElm.text().convertT2S());
        var genres = [{
            title: objGen ? objGen.title : DEFAULT_GEN[0].title,
            input: objGen ? objGen.input : DEFAULT_GEN[0].input,
            script: objGen ? objGen.script : DEFAULT_GEN[0].script
        }];

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().replace('作者：', '').convertT2S(),
            cover: cover,
            description: doc.select("#detail-box > div > div.ui_bg6 > div.box_intro > div.box_info > table > tbody > tr:nth-child(3) > td > div").text().convertT2S(),
            detail: doc.select("#detail-box > div > div.ui_bg6 > div.box_intro > div.box_info > table > tbody > tr:nth-child(6) > td:nth-child(4)").text().convertT2S()
                + "\n最新章节: " + doc.select("#tab_chapters > ul > li:nth-child(1) > a > span").text().convertT2S(),
            host: BASE_URL,
            ongoing: doc.select("#detail-box > div > div.ui_bg6 > div.box_intro > div.box_info > table > tbody > tr:nth-child(5) > td:nth-child(3)").text().indexOf("連載中") != -1,
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName.convertT2S(),
                    script: "comment.js"
                }
            ],
            genres: genres
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}