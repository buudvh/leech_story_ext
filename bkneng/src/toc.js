load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = bkBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Mục lục bản wap có đủ mọi chương trên một trang (mục ẩn bằng display:none vẫn nằm trong HTML)
        // và đánh dấu chương khoá bằng .directoryLocked; mục lục bản máy tính không đánh dấu.
        url = BASE_URL + '/wap/book/info/' + bookId + '.html';
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var data = [];
        doc.select('a.bookInfo_DirectoryMain').forEach(function (e) {
            var href = e.attr('href');
            if (!href) return;
            var isLocked = e.select('.directoryLocked').size() > 0;
            data.push({
                name: formatName(e.select('.bookInfo_DirectoryMain_In').first().text()) + (isLocked ? ' 🔒︎' : ''),
                url: href,
                pay: isLocked,
                host: BASE_URL
            });
        });

        if (!data.length) throw new Error('Length = 0');

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
