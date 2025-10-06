load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        if (page == '1') {
            url = url.replace('ajax_novels', 'novels');
        }
        url = String.format(BASE_URL + url, page);
        let response = fetch(url);
        if (response.ok) {
            let doc = response.html('gbk');
            var data = [];
            var elems = $.QA(doc, 'li');
            if (!elems.length) return Response.error(url);
            elems.forEach(function (e) {
                data.push({
                    name: $.Q(e, '.newnav h3 > a:not([class])').text().trim(),
                    link: $.Q(e, 'h3 > a').attr('href'),
                    cover: e.select("img").attr("data-src") || DEFAULT_COVER,
                    description: $.Q(e, '.zxzj > p').text().replace('最近章节', ''),
                    host: BASE_URL
                })
            })
            var next = parseInt(page, 10) + 1;
            return Response.success(data, next.toString());
        }

        return Response.error(`fetch ${url} failed: status ${response.status}`);
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}