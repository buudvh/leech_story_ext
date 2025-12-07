load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = BASE_URL + url
        var data = [];
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("dt > a");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select("img").first().attr("alt").convertT2S(),
                link: e.attr("href"),
                cover: e.select("img").first().attr("src") || DEFAULT_COVER,
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (e) {
        return Response.error(`Url: ${url} \nMessage: ${e.message}`);
    }
}