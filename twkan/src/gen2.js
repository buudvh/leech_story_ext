load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = url.replace(/_\d+\.html$/, '_' + page + '.html');
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#article_list_content li");

        if(!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: convertT2S(e.select("h3").first().text()),
                link: e.select("a").first().attr("href"),
                cover: buildCoverUrl(e.select("a").first().attr("href")) || DEFAULT_COVER,
                description: convertT2S(e.select('.ellipsis_2').text()),
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (e) {
        Response.error(`fetch ${url} failed: ${e.message}`);
    }
}