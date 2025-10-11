load('config.js');
load('libs.js');

function execute(url) {
    try {
        var fetchUrl = url.replace('https', PROTOCOL);
        if (!fetchUrl.endsWith("/")) {
            fetchUrl = fetchUrl + "/";
        }

        var response = fetch(fetchUrl);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        return Response.success({
            name: convertT2S(doc.select("h1").first().text()),
            cover: createCoverImg(doc.select("div.bookcover img").first().attr("src")),
            author: convertT2S(doc.select("div.bookinfo a").first().text()),
            description: convertT2S(doc.select("p.bookintro").first().text()),
            detail: convertT2S(doc.select("p.booktime").first().text()),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: BASE_URL + doc.select(".booktag a").first().attr("href"),
                    script: "gen.js"
                }
            ],
        });
    } catch (error) {
        return Response.error('fetch: ' + url + '\nfailed: ' + error.message);
    }
}

function createCoverImg(src) {
    var DEFAULT_COVER_UUKANSHU = 'https://uukanshu.cc/modules/article/images/nocover.jpg';
    if (src == DEFAULT_COVER_UUKANSHU || !src) return DEFAULT_COVER;
    return src;
}