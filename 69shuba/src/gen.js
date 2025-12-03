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

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html('gbk');
        var data = [];
        var elems = $.QA(doc, 'li');

        if (!elems.length) throw new Error("Length = 0");


        elems.forEach(function (e) {
            // var bookid = extractBookId($.Q(e, 'h3 a').attr('href'), false);
            data.push({
                name: $.Q(e, '.newnav h3 > a:not([class])').text().trim(),
                // link: STVHOST + "/truyen/69shu/1/" + bookid + "/",
                link: $.Q(e, 'h3 a').attr('href'),
                cover: e.select("img").attr("data-src") || DEFAULT_COVER,
                description: $.Q(e, '.zxzj > p').text().replace('最近章节', '')
                    + "\n" + $.Q(e, 'ol.ellipsis_2').text(),
            })
        })
        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}