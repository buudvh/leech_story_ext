load('libs.js');

function execute(url) {
    try {
        url = url.replace(ORIGINAL_HOST1, REPLACE_HOST).replace(ORIGINAL_HOST2, REPLACE_HOST);

        var response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var doc = response.html('gb2312');

        var data = [];
        var elems = $.QA(doc, 'div.book_list.clearfix > ul > li');
        if (!elems.length) return Response.eror(url);

        elems.forEach(function (e) {
            data.push({
                name: $.Q(e, 'a').text().trim().replace(/第(\d+)节/g, '第$1章'),
                url: $.Q(e, 'a').attr('href'),
                host: BASE_URL
            })
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}