load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = miduBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Truyện bị gỡ trả code -101 "因产品策略调整，当前书籍不可阅读".
        var book = miduApi('/fiction/book/getDetail', 'book_id=' + bookId);
        if (!book || !book.title) throw new Error('Không thấy thông tin truyện');

        var ended = String(book.end_status) == '1';
        var genres = [];
        // categoryId của chi tiết trùng id kênh của danh sách (khác categoryId của kết quả tìm kiếm).
        if (book.category && book.categoryId && book.categoryId != '0') {
            genres.push({ title: book.category, input: 'second_channel=' + book.categoryId + '&status=0&rank=', script: 'gen.js' });
        }

        var tags = (book.tags || []).map(function (t) { return t && t.name; }).filter(function (x) { return x; });

        return Response.success({
            name: cleanText(book.title),
            cover: (book.coverImage && book.coverImage.original) || book.cover || DEFAULT_COVER,
            author: cleanText(book.author),
            description: introduce(book.description),
            detail: [
                [book.category, ended ? '完结' : '连载', wordCount(book.word_count)].filter(function (x) { return x; }).join(' · '),
                book.score ? '评分: ' + book.score : '',
                book.hot ? '热度: ' + book.hot + (book.hotLabel || '') : '',
                tags.length ? '标签: ' + tags.join('、') : '',
                book.updateStatus && book.updateStatus != '完结' ? book.updateStatus : ''
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: !ended,
            url: miduBookUrl(bookId),
            host: BASE_URL,
            genres: genres
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function introduce(text) {
    return String(text || '').split(/\r?\n/).map(function (x) {
        return x.replace(/^[\s\u3000\u00a0]+|[\s\u3000\u00a0]+$/g, '');
    }).filter(function (x) { return x; }).join('<br>');
}
