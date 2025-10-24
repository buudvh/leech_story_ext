load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > ul > li");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            var bookurl = BASE_URL + e.select("a").first().attr("href");
            var match = bookurl.match(/\/book\/(\d+)\/?$/);
            var bookId = match ? match[1] : null;
            data.push({
                name: convertT2S(e.select("a").first().text()), //e.select('a:nth-child(2)').text(),
                link: BASE_URL + e.select("a").first().attr("href"),
                ///image/36/36755/36755s.jpg
                cover: bookId ? `${BASE_URL}/image/${bookId.slice(0, bookId.length - 3)}/${bookId}/${bookId}s.jpg`
                    : DEFAULT_COVER,
                description: convertT2S(e.select("span").first().text())
                    + "\n最新： " + convertT2S(e.select(".gray").first().text()),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}