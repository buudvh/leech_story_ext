load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = miduBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Một file JSON chứa toàn bộ mục lục (truyện dài vài nghìn chương ⇒ vài MB); host đầu treo thì 30s sau thử host dự phòng.
        url = BOOK_HOSTS[0] + '/book/chapter_list/100/' + bookId + '.txt';
        var response = fetchBookFile('/book/chapter_list/100/' + bookId + '.txt', 30000);
        var list = response.json() || [];

        var data = [];
        list.forEach(function (c) {
            if (!c || !c.chapterId || isAdChapter(c.title)) return;
            // Mọi chương hiện có price "0"; giữ kiểm tra phòng khi trang bật thu phí.
            var pay = parseFloat(c.price || '0') > 0 || parseFloat(c.coin_amount || '0') > 0;
            data.push({
                name: cleanChapterName(c.title) + (pay ? ' 🔒︎' : ''),
                url: miduChapterUrl(c),
                pay: pay,
                host: BOOK_HOSTS[0]
            });
        });

        if (!data.length) throw new Error('Length = 0');

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
