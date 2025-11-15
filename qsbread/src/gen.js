load('config.js');
load('libs.js');

function execute(url, page) {
    try {
        if (!page) {
            page = '1';
        }
        let response = fetch(BASE_URL + url + "/" + page + "/");

        if (!response.ok) throw new Error("Status = " + response.status);

        let doc = response.html();

        let bookList = [];
        let next = doc.select(".pagination").select("strong + a").text();
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
        return Response.success(bookList, next);
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}