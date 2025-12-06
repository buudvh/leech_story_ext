load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = BASE_URL + url
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".waps_one");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select("a.bookname").first().text().convertT2S(),
                link: e.select("a.bookname").first().attr("href"),
                cover: DEFAULT_COVER,
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (e) {
        return Response.error(`Url: ${url} \nMessage: ${e.message}`);
    }
}