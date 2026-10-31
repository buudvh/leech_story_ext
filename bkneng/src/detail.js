load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = bkBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Bản wap có bìa gốc và đánh dấu chương khoá; bản máy tính thì không.
        var doc = bkFetchHtml('/wap/book/info/' + bookId + '.html');
        var name = doc.select('.bookInfo_MainName').first().text();
        if (!name) throw new Error('Không thấy truyện (có thể đã gỡ)');

        var infos = doc.select('.bookInfo_MainRight .bookInfo_MainClass');
        var spans = doc.select('.bookInfo_MainAuthor span');
        var status = spans.get(2).text();
        var chapters = doc.select('a.bookInfo_DirectoryMain');
        var locked = doc.select('a.bookInfo_DirectoryMain .directoryLocked').size();
        var latest = chapters.size() ? chapters.last().select('.bookInfo_DirectoryMain_In').first().text() : '';

        var intro = doc.select('.bookInfo_MainSynopsisIn1').first().html()
            .replace(/^\s*简介[：:]\s*/, '').trim();

        return Response.success({
            name: name,
            cover: bkCover(doc.select('.bookInfo_MainHead img').first().attr('src')),
            author: infos.get(0).text(),
            description: intro.replace(/\r?\n/g, '<br>'),
            detail: [
                bkJoin([spans.get(0).text(), spans.get(1).text(), status], ' · '),
                infos.get(1).text(),
                '章节: ' + chapters.size() + (locked ? '（免费 ' + (chapters.size() - locked) + ' 章）' : ''),
                latest ? '最新: ' + latest : ''
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: status.indexOf('完结') == -1,
            url: bkBookUrl(bookId),
            host: BASE_URL,
            genres: []
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
