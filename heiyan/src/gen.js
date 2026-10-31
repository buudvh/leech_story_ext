load('libs.js');
load('config.js');

function execute(input, page) {
    var url;
    try {
        page = page || '1';
        url = BASE_URL + '/all/' + input + '_' + page + '.html';
        var response = fetch(url, { headers: PC_HEADERS });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var data = [];
        doc.select('#resultDiv tr').forEach(function (e) {
            var a = e.select('a.title').first();
            var link = a.attr('href');
            if (!link) return;
            var author = e.select('a.author').first().text();
            var latest = e.select('a.chapter').first().text();
            data.push({
                name: a.text(),
                link: link,
                cover: DEFAULT_COVER,
                description: '作者: ' + author + (latest ? '\n最新: ' + latest : ''),
                host: BASE_URL
            });
        });

        if (!data.length) throw new Error('Length = 0');

        var hasNext = false;
        doc.select('a').forEach(function (a) {
            if (a.text() == '下一页') hasNext = true;
        });

        return Response.success(data, hasNext ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
