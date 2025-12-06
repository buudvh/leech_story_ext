load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        let response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html();
        var data = [];
        var elems = doc.select('.list ul li')

        if (!elems.length) throw new Error("Length = 0");

        elems.forEach(function (e) {
            data.push({
                name: e.select('.book .name a').first().text(),
                link: e.select('.book .name a').first().attr("href"),
                cover: e.select('.image img').first().attr("data-original"),
                description: '作者: ' + e.select('.author').first().text()
                    + "\n" + e.select(".desc.line_3").first().text(),
            });
        })

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}