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
                name: e.select("a").first().text().convertT2S(),
                link: e.select("a").first().attr("href"),
                cover: bookId ? `${BASE_URL}/image/${bookId.slice(0, bookId.length - 3)}/${bookId}/${bookId}s.jpg`
                    : DEFAULT_COVER,
                description: e.select("span").first().text().convertT2S()
                    + "\n最新： " + e.select(".gray").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}