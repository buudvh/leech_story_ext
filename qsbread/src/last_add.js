load('config.js');
load('libs.js');

function execute(url, page) {
    try {
        var response = fetch(BASE_URL);

        if (!response.ok) throw new Error("Status = " + response.status);

        var doc = response.html();

        var bookList = [];
        doc.select(".layout-col1").last().select("li").forEach(e => {
            let link = e.select(".s2 a").first().attr("href");
            let cover = buildCover(getIdFromUrl(link));
            bookList.push({
                name: formatName(e.select(".s2 a").first().text()),
                link: link,
                cover: cover,
                description: e.select(".s5").text(),
                host: BASE_URL
            });
        })
        return Response.success(bookList);
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}