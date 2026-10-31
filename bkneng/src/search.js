load('libs.js');
load('config.js');

// Trang đã tắt tìm kiếm (/www/search và /wap/index/search luôn trả 404), nên:
// - từ khoá là id hoặc link truyện ⇒ mở thẳng truyện đó;
// - còn lại ⇒ lọc theo tên/tác giả/thể loại trong mọi danh sách đề cử của kênh nam và nữ.
function execute(key, page) {
    var url;
    try {
        if (page && page != '1') return Response.success([], '');

        key = String(key || '').trim();
        var bookId = /^\d{6,}$/.test(key) ? key : bkBookId(key);
        if (bookId) {
            url = BASE_URL + '/wap/book/info/' + bookId + '.html';
            var item = bkWapBookItem(bookId);
            return Response.success(item ? [bkToResult(item)] : [], '');
        }

        var data = [];
        var seen = {};
        ['boy', 'girl'].forEach(function (channel) {
            try {
                url = BASE_URL + WAP_PAGES[channel];
                bkParseWapSection(bkFetchHtml(WAP_PAGES[channel]), '', data, seen);
            } catch (error) {
            }
            try {
                url = BASE_URL + PC_PAGES[channel];
                var doc = bkFetchHtml(PC_PAGES[channel]);
                bkParsePcSection(doc, '', data, seen);
                bkParsePcSection(doc, 'hot', data, seen);
                bkParsePcSection(doc, 'update', data, seen);
            } catch (error) {
            }
        });
        if (!data.length) throw new Error('Không tải được danh sách truyện');

        var words = key.toLowerCase().split(/\s+/).filter(function (w) { return w; });
        var result = data.filter(function (e) {
            var text = (e.name + ' ' + (e.author || '') + ' ' + (e.category || '')).toLowerCase();
            return words.every(function (w) { return text.indexOf(w) != -1; });
        });

        return Response.success(result.map(bkToResult), '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}

function bkWapBookItem(bookId) {
    var doc = bkFetchHtml('/wap/book/info/' + bookId + '.html');
    var name = doc.select('.bookInfo_MainName').first().text();
    if (!name) return null;
    var spans = doc.select('.bookInfo_MainAuthor span');
    return {
        id: bookId,
        name: name,
        author: doc.select('.bookInfo_MainRight .bookInfo_MainClass').first().text(),
        category: spans.get(0).text(),
        extra: bkJoin([spans.get(1).text(), spans.get(2).text()], ' · '),
        cover: doc.select('.bookInfo_MainHead img').first().attr('src'),
        intro: doc.select('.bookInfo_MainSynopsisIn1').first().text().replace(/^简介[：:]\s*/, '')
    };
}
