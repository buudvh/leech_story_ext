load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();

        var authorNm = doc.select('h1 > em').text().replace('作者:','');
        var bookNmElm = doc.select('h1');
        bookNmElm.select('em').remove();

        return Response.success({
            name: bookNmElm.text().formatTocName(),
            author: authorNm.convertT2S(),
            cover: doc.select('div.pic > em > img').attr('src'),
            description: doc.select("div.intro").html().convertT2S(),
            detail: doc.select("#main > div:nth-child(1) > div.detail-cols.fn-clear > div.ui_bg6 > div.box_intro > div.box_info > table > tbody > tr:nth-child(4) > td:nth-child(3)").text().convertT2S(),
            host: BASE_URL,
            comments: [
                {
                    title: "QQ Comments",
                    input: bookNmElm.text().formatTocName().convertT2S(),
                    script: "comment.js"
                }
            ],
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}