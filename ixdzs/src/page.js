load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data = [];
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var perPageText = doc.select("body > section:nth-child(6) > div > div > div > div.pages > ul > li.page-item.disabled > a").text();
        var pageCount = parseInt(perPageText.split('/')[1], 10);

        if(!chapternums.length) throw new Error("Length = 0");

        for (let index = 1; index <= pageCount; index++) {
            data.push(`${url}/index_${index}.html`)
        }

        return Response.success(data);
    } catch (error) {
        return Response.error(error.message);
        // return Response.success([
        //     error.message,
        // ]);
    }
}