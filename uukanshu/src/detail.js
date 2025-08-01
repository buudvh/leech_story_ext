load('libs.js');
function execute(url) {
    try {
        let fetchUrl = url.replace('https','http');
        if (!fetchUrl.endsWith("/")) {
            fetchUrl = fetchUrl + "/";
        }
        let response = fetch(fetchUrl);
        if (response.ok) {
            let doc = response.html();
            return Response.success({
                name: doc.select("h1").first().text(),
                cover: doc.select("div.bookcover img").first().attr("src"),
                author: doc.select("div.bookinfo a").first().text(),
                description: doc.select("p.bookintro").first().text(),
                detail: doc.select("p.booktime").first().text(),
                host: "",
                lastChapter: "",
                tocUrl: ""
            });
        }
        return Response.success({
            name: "BUG",
            cover: "",
            author: "",
            description: "failed to fetch: " + response.status,
            detail: fetchUrl,
            host: "",
            lastChapter: "",
            tocUrl: ""
        });
    } catch (error) {
        return Response.success({
            name: "BUG",
            cover: "",
            author: "",
            description: error.message,
            detail: "",
            host: "",
            lastChapter: "",
            tocUrl: ""
        });
    }
}