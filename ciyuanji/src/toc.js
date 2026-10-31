load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = ciyuanjiBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Trang chi tiết đã có toàn bộ mục lục (đúng thứ tự quyển/chương), không cần trang riêng.
        url = BASE_URL + '/b_d_' + bookId + '.html';
        var response = fetch(url, { headers: PC_HEADERS, timeout: FETCH_TIMEOUT });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var props = ciyuanjiNextData(response).props;
        var chapters = props.bookChapter && props.bookChapter.chapterList;
        if (!chapters) throw new Error('Trang chi tiết không có mục lục');

        var data = [];
        chapters.forEach(function (c) {
            if (!c || !c.chapterId) return;
            // Cờ là chuỗi '0'/'1'.
            var isVip = String(c.isFee) == '1' && String(c.isBuy) != '1';
            data.push({
                name: formatName(String(c.chapterName || c.title || '').replace(/\s+/g, ' ').trim()) + (isVip ? ' 🔒︎' : ''),
                url: BASE_URL + '/chapter/' + bookId + '_' + c.chapterId + '.html',
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
