load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = BASE_URL + replacePageBySegments(url, page);
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".list-item");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: convertT2S(e.select(".article > a").first().text()),
                link: BASE_URL + e.select(".article > a").first().attr("href"),
                cover: e.select("img").first().attr("src") || DEFAULT_COVER,
                // description: convertT2S(e.select("span.mr15").first().text()) + "\n" +convertT2S(e.select("span.fs12").first().text()),
                description: '作者: ' + getAuthorName(convertT2S(e.select("span.mr15").first().text()))
                    + "\n" + convertT2S(e.select("span.fs12").first().text()),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (e) {
        Response.error(`fetch ${url} failed: ${e.message}`);
    }
}

function getAuthorName(text){
    //作者:星域　86萬字
    const match = text.match(/^作者:(.+?)\u3000[\d一二三四五六七八九十百千万萬]+字$/);
    return (match ? match[1].trim() : null);
}

function replacePageBySegments(url, page) {
    var parts = url.split("/");
    if (parts.length == 5) {
        parts[3] = page;
        return parts.join("/")
    }

    return url;
}