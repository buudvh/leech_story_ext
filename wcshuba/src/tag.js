load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || "1";
        url = BASE_URL + url + page;
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("dt > a");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select("img").first().attr("alt").convertT2S(),
                link: e.attr("href"),
                cover: e.select("img").first().attr("src") || DEFAULT_COVER,
                description: e.text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (e) {
        return Response.error(`Url: ${url} \nMessage: ${e.message}`);
    }
}