load('config.js');

// https://wechat.idejian.com/api/wechat/book/13178363

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    if (url.slice(-1) !== "/") {
        url = url + "/";
    }
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        var author = doc.select(".detail_bkauthor").first().text();
        var title = doc.select(".detail_bkinfo .detail_bkname a").text();
        var coverImg = doc.select(".detail_bkinfo .book_img > img").attr("src");
        var category = doc.select(".detail_bkgrade > span:nth-child(2)").html().replace(/<span>/g, '<br>');
        var tag = doc.select(".detail_bkgrade").last().select("span");
        var descriptionMeta = doc.select(".bk_brief .brief_con").html();
        var status = doc.select(".detail_bkgrade > span.light_box").html();
        var views = doc.select(".bk_fontinfo").html().replace(/<span>/g, '<br>');
        var rating = doc.select(".detail_bkinfo_rig strong").text();

        var genres = [];
        genres.push({
            title: category,
            input: '&update',
            script: "search.js"
        });

        for (var i = 0; i < tag.size(); i++) {
            var e = tag.get(i);
            genres.push({
                title: e.text(),
                input: '&update',
                script: "search.js"
            });
        }

        var detail = status + "<br>‎<br>" + views + "<br>ㅤ‎<br>" + rating;

        return Response.success({
            name: title,
            cover: coverImg,
            author: author,
            description: descriptionMeta,
            detail: detail,
            host: BASE_URL,
            genres: genres
        });
    }
    return null;
}
