load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = taduBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Nhận cả url trang mục lục (từ page.js) lẫn url chi tiết truyện.
        var pgMatch = String(url).match(/[?&]pgNum=(\d+)/);
        var pgNum = pgMatch ? parseInt(pgMatch[1], 10) : 1;
        url = taduCatalogUrl(bookId, pgNum);
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var start = pageStart(doc, pgNum);

        var data = [];
        var index = 0;
        doc.select('ul.chapter_ul li a').forEach(function (e) {
            var href = e.attr('href');
            if (!href) return;
            var name = e.select('p').first().text() || e.text();
            // Chương thứ FREE_CHAPTER_LIMIT+1 trở đi cần đăng nhập; icon <i> là dấu khoá của trang.
            var locked = start + index >= FREE_CHAPTER_LIMIT || e.select('i').size() > 0;
            index++;
            data.push({
                name: formatName(cleanText(name)) + (locked ? ' 🔒︎' : ''),
                url: href,
                pay: locked,
                host: BASE_URL
            });
        });

        if (!data.length) throw new Error('Length = 0');

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

// Số thứ tự (0-based) của chương đầu trang, lấy từ option đang chọn "101-200章".
function pageStart(doc, pgNum) {
    var start = (pgNum - 1) * CHAPTERS_PER_PAGE;
    doc.select('#chapter option').forEach(function (e) {
        if (!e.attr('selected')) return;
        var m = e.text().match(/^(\d+)/);
        if (m) start = parseInt(m[1], 10) - 1;
    });
    return start;
}
