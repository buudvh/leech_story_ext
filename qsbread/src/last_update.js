load('config.js');
load('libs.js');

function execute(url, page) {
    try {
        let response = fetch(BASE_URL);

        if (!response.ok) throw new Error("Status = " + response.status);

        let doc = response.html();

        let bookList = [];
        doc.select(".layout-col2").last().select("li").forEach(e => {
            let link = e.select(".s2 a").first().attr("href");
            let cover = buildCover(getIdFromUrl(link));
            bookList.push({
                name: formatName(e.select(".s2 a").first().text()),
                link: link,
                cover: cover,
                description: e.select(".s3").text(),
                host: BASE_URL
            });
        })
        return Response.success(bookList);
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}