load('libs.js');
load('config.js');

function execute(url) {
    try {
        let response = fetch(url);
        if (response.ok) {
            let doc = response.html('gbk');
            var data = [];
            var elems = doc.select("div.newbox li")
            if (!elems.length) return Response.error(url);
            elems.forEach(function (e) {
                data.push({
                    name: e.select("h3").text().trim(),
                    link: e.select("h3 a").attr('href'),
                    cover: e.select("img").attr("data-src") || DEFAULT_COVER,
                    description: $.Q(e, '.zxzj > p').text().replace('最近章节', ''),
                    host: BASE_URL
                })
            })
            return Response.success(data);
        }

        return Response.error(`fetch ${url} failed: status ${response.status}`);
    } catch (e) {
        return Response.error(`fetch ${url} failed: ${e.message}`);
    }
}