load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = heiyanBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        url = BASE_URL + '/chapter/' + bookId;
        // Mục lục bản máy tính có đủ mọi chương trên một trang và đánh dấu chương VIP (a.isvip).
        var response = fetch(url, { headers: PC_HEADERS });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var data = [];
        doc.select('.chapter-list ul li a').forEach(function (e) {
            var href = e.attr('href');
            if (!href) return;
            var isVip = e.attr('class').indexOf('isvip') != -1;
            data.push({
                name: formatName(e.text()) + (isVip ? ' 🔒︎' : ''),
                url: href,
                pay: isVip,
                host: BASE_URL
            });
        });

        if (!data.length) throw new Error('Length = 0');

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
