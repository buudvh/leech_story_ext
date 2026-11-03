load('crypto.js');
load('config.js');

// Mục lục đủ chương trong một lượt (truyện 4531 chương vẫn một request).
function execute(url) {
    var bookId = parseBookId(url);
    if (!bookId) return Response.error('Không đọc được id truyện từ link: ' + url);
    try {
        var data = fetchApp(APP_KS, '/api/v1/chapter/chapter-list', { id: bookId });
        var chapters = (data.chapter_lists || []).filter(function (c) { return c && c.id; }).map(function (c) {
            return { name: cleanText(c.title), url: chapterUrl(bookId, c.id), host: BASE_URL };
        });
        if (!chapters.length) throw new Error('Truyện chưa có chương');
        return Response.success(chapters);
    } catch (error) {
        return Response.error('Qimao: ' + error.message + '\nUrl: ' + url);
    }
}
