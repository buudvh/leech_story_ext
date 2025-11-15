load('config.js');
load('libs.js');

function execute(url) {
    try {
        url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
        let response = fetch(url + "/");

        if (!response.ok) throw new Error("Status = " + response.status);

        let doc = response.html();

        let cover = doc.select(".imgbox img").first().attr("src");
        if (cover.indexOf("nocover") !== -1 || !cover) {
            cover = DEFAULT_COVER;
        }
        return Response.success({
            name: formatName(doc.select(".info h1").first().text()),
            cover: doc.select(".imgbox img").first().attr("src"),
            author: doc.select(".info a[href~=author]").text(),
            description: cleanHtml(doc.select(".info .desc").html()).replace(/([.!?…]+)/g, function (match) {
                return match + "\n";
            }),
            detail: $.QA(doc, '.info p',
                {
                    m: function (x) { return x.text().indexOf("最后更新：") == 0 ? x.text() : ""; }
                    , j: '<br>'
                }),
            host: BASE_URL,
        });
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}