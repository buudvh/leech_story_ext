load('libs.js');
load('config.js');

function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#newscontent .l li").forEach(e => {
            var link = e.select(".s2 a").first().attr("href");
            data.push({
                name: e.select(".s2 a").first().text(),
                link: link,
                cover: buildCover(getBookId(link)),
                description: e.select(".s3 a").first().text(),
                host: BASE_URL,
            })
        });

        return Response.success(data)
    }
    return null;
}