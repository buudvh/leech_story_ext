load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = fengduBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');
        url = fengduBookUrl(bookId);

        // Nền tảng miễn phí (sống nhờ quảng cáo): API không có cờ VIP, mọi chương đều đọc được.
        var chapters = (fengduBookInfo(bookId).bookChapterAllInfo || []).slice().sort(function (a, b) {
            return (parseInt(a.chapterId, 10) || 0) - (parseInt(b.chapterId, 10) || 0);
        });

        var data = [];
        chapters.forEach(function (e) {
            if (!e || !e.chapterId) return;
            data.push({
                name: fengduChapterName(e.chapterTitle) || ('第' + e.chapterId + '章'),
                url: fengduChapterUrl(e),
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
