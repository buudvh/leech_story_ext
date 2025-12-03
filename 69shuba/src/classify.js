load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = url.replace("https://www.69shuba.com", "");
        url = url.substring(1, url.lastIndexOf('.'));
        url = 'ajax_' + url + '/' + page + '.htm';
        url = "https://www.69shuba.com/" + url;
        let response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html('gbk');
        var data = [];
        var elems = $.QA(doc, 'li');

        if (!elems.length) throw new Error("Length = 0");

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
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}