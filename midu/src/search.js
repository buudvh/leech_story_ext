load('libs.js');
load('config.js');

function execute(key, page) {
    var url = API_URL + '/fiction/search/search';
    try {
        page = page || '0';
        var list = miduApi('/fiction/search/search', 'keyword=' + encodeURIComponent(key) + '&page=' + page) || [];

        var data = [];
        list.forEach(function (e) {
            // Trang đầu có thêm khối "truyện tương tự" (itemType 5, không có book_id).
            if (!e || !e.book_id) return;
            var ended = String(e.end_status) == '1';
            data.push({
                name: cleanText(e.title),
                link: miduBookUrl(e.book_id),
                cover: miduCover(e),
                description: '作者: ' + cleanText(e.author) + ' | ' + (e.category || '')
                    + ' | ' + (ended ? '完结' : '连载') + (e.chapterNum ? ' · ' + e.chapterNum + '章' : '')
                    + (e.description ? '\n' + cleanText(e.description) : ''),
                host: BASE_URL
            });
        });

        // Chỉ trang rỗng mới là hết; số mục mỗi trang không cố định.
        return Response.success(data, list.length > 0 ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
