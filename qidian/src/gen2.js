load('libs.js');
load('config.js');

function execute(url, page) {
    page = page || '1';
    url = String.format(BASE_URL + "/tag" + url, page);

    try {
        let response = fetch(url);
        if (response.ok) {
            let doc = response.html('gbk');
            var data = [];
            var elems = doc.select("ul#article_list_content li")
            elems.forEach(function (e) {
                data.push({
                    name: e.select("h3").text().trim(),
                    link: e.select("h3 a").attr('href'),
                    cover: e.select("img").attr("data-src") || DEFAULT_COVER,
                    description: $.Q(e, '.zxzj > p').text().replace('最近章节', ''),
                    host: BASE_URL
                })
            })
            var next = parseInt(page, 10) + 1;
            return Response.success(data, next.toString());
        }

        Response.error(`fetch ${url} failed: status ${response.status}`);
    } catch (e) {
        Response.error(`fetch ${url} failed: ${e.message}`);
    }
}