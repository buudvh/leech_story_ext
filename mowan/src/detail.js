load('libs.js');
load('config.js');

function execute(url) {
    try {
        var ref = mowanBookRef(url);
        if (!ref) throw new Error('Không đọc được nguồn/id truyện từ link');

        var data = mowanApi('/book/detail', { source: ref.source, book_id: ref.bookId }) || {};
        var book = data.book || data;
        var name = cleanText(book.name || book.title || book.book_name || ref.name);
        if (!name) throw new Error('Không thấy thông tin truyện');

        var type = mowanType(book.type);
        var status = cleanText(book.status);
        var ended = /完结|完本|已完|全本|finish|end/i.test(status);
        var description = String(book.description || book.intro || '').split(/\r?\n/).map(function (x) {
            return x.replace(/^[\s　 ]+|[\s　 ]+$/g, '');
        }).filter(function (x) { return x; }).join('<br>');

        return Response.success({
            name: name,
            cover: mowanCover(book.cover),
            author: cleanText(book.author) || '佚名',
            description: description || '暂无简介',
            detail: [
                type != 'novel' ? '⚠ Đây là ' + mowanTypeName(type) + ', tiện ích chỉ đọc được truyện chữ' : '',
                [cleanText(book.category), status, book.chapters_count ? book.chapters_count + '章' : ''].filter(function (x) {
                    return x;
                }).join(' · '),
                '来源: ' + cleanText(book.source || ref.source),
                book.latest_chapter ? '最新: ' + cleanChapterName(book.latest_chapter) : '',
                book.latest_update_time ? '更新: ' + cleanText(book.latest_update_time) : ''
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: !ended,
            url: mowanBookUrl(ref.source, ref.bookId, name),
            host: BASE_URL,
            genres: []
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
