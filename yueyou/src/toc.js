load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = yueyouBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Trang /c/<id>.html có đủ mọi chương trên một trang (truyện dài tới vài nghìn chương ⇒ chờ lâu hơn).
        url = BASE_URL + '/c/' + bookId + '.html';
        var response = fetch(url, { timeout: 60000 });
        if (response.status == 404) return Response.error(GONE_MESSAGE + '\nUrl: ' + url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        // Bỏ nhãn <span class="type">免费</span> nếu có trong link chương.
        doc.select('a[href^="/r/"] span').remove();

        var data = [];
        var seen = {};
        var prefix = '/r/' + bookId + '/';
        doc.select('a[href^="/r/"]').forEach(function (e) {
            var href = e.attr('href');
            if (href.indexOf(prefix) != 0 || seen[href]) return;
            seen[href] = true;
            // Truyện thu phí đã bị lọc khỏi danh sách; bản web mở mọi chương của truyện còn lại.
            data.push({
                name: cleanChapterName(e.text()),
                url: href,
                pay: false,
                host: BASE_URL
            });
        });

        if (!data.length) throw new Error('Length = 0');

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
