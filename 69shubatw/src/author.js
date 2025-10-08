load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = BASE_URL + url
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("dt > a");

        if(!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: convertT2S(e.select("img").first().attr("alt")),
                link: BASE_URL + e.attr("href"),
                cover: e.select("img").first().attr("src") || DEFAULT_COVER,
                description: convertT2S(e.text()),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (e) {
        return Response.error(`fetch ${url} failed: ${e.message}`);
    }
}