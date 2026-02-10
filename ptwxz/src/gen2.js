load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || "1";
        url = String.format(url, page);
        let response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html('gbk');
        let elms = doc.select("#content > table > tbody > tr");

        if (!elms.length) throw new Error("Length = 0");

        let data = [];
        elms.forEach(e => {
            var bookElm = e.select("td:nth-child(1) > a");
            if (!bookElm) return;
            var link = bookElm.attr("href");
            data.push({
                name: e.select("td:nth-child(1) > a").text(),
                link: link,
                cover: buildCover(getBookid(link)),
                description: `作者: ${e.select("td:nth-child(3)").text()}`
                    + `\n最新: ${e.select("td:nth-child(2)").text()}`,
                host: BASE_URL
            })
        });

        let next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        // return Response.error(`Url: ${url} \nMessage: ${error.message}`);
        return Response.success([{
            name: "error",
            link: '',
            description: error.message,
        }]);
    }
}