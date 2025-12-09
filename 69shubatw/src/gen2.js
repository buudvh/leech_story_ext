load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = BASE_URL + replacePageBySegments(url, page);
        var data = [];
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".list-item");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            var cover = e.select("img").first().attr("src") || DEFAULT_COVER
            if(cover.indexOf('//') == 0) cover = "http:" + cover;
            data.push({
                name: e.select(".article > a").first().text().convertT2S(),
                link: e.select(".article > a").first().attr("href"),
                cover: cover,
                description: '作者: ' + getAuthorName(e.select("span.mr15").first().text().convertT2S())
                    + "\n" + e.select("span.fs12.gray").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}

function getAuthorName(text) {
    //作者:星域　86萬字
    const match = text.match(/^作者:(.+?)\u3000[\d一二三四五六七八九十百千万萬]+字$/);
    return (match ? match[1].trim() : null);
}

function replacePageBySegments(url, page) {
    url = String.format(url, page);

    var parts = url.split("/");
    if (parts.length == 5) {
        parts[3] = page;
        return parts.join("/")
    }

    return url;
}