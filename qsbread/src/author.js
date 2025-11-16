load('config.js');
load('libs.js');

function execute(url, page) {
    try {
        url = BASE_URL + "/author/" + url;
        var response = fetch(url);

        if (!response.ok) throw new Error("Status = " + response.status);

        var doc = response.html();

        var bookList = [];

        var elms = doc.select(".item");

        if (!elms.length) throw new Error("Length = 0");

        elms.forEach(e => {
            var link = e.select("a").first().attr("href");
            bookList.push({
                name: formatName(e.select("dl dt a").first().text()),
                link: link,
                cover: e.select(".image img").first().attr("src"),
                description: e.select("dd").text(),
                host: BASE_URL
            });
        })
        return Response.success(bookList);
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}