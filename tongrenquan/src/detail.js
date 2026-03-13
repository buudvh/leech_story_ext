load('libs.js');

function execute(url) {
    try {
        url = url.replace(ORIGINAL_HOST1, REPLACE_HOST).replace(ORIGINAL_HOST2, REPLACE_HOST);

        var response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var doc = response.html('gb2312');

        return Response.success({
            name: $.Q(doc, 'div.infos > h1').text().formatTocName(),
            cover: BASE_URL + doc.select('body > div.readContent > div.book_info.clearfix > div.pic > img').attr('src'),
            author: $.Q(doc, 'div.date > span').text().replace('作者：', ''),
            description: $.Q(doc, 'div.booktips + p').text(),
            detail: $.Q(doc, 'div.date', { remove: 'span' }).text().replace('日期：', '更新：'),
            host: BASE_URL
        });
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}
