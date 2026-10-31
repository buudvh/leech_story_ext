load('libs.js');
load('config.js');

// input = id truyện. API: /api/v1/comment-<id>-<số mục đã tải>?page=<trang>, 10 mục mỗi trang.
function execute(input, page) {
    var url;
    try {
        page = parseInt(page || '1', 10);
        url = BASE_URL + '/api/v1/comment-' + input + '-' + ((page - 1) * 10) + '?page=' + page;
        var response = fetch(url);
        if (!response.ok) {
            // Quá trang cuối API trả 500.
            if (page > 1) return Response.success([], '');
            throw new Error(`Status ${response.status}`);
        }

        var json = response.json();
        if (!json || json.status != 100) {
            if (page > 1) return Response.success([], '');
            throw new Error((json && json.msg) || 'Không đọc được bình luận');
        }

        var doc = Html.parse(json.data.bookList || '');
        var data = [];
        doc.select('li').forEach(function (e) {
            // Nội dung lấy text(): có bình luận chứa sẵn thẻ HTML.
            var content = cleanText(e.select('p').first().text());
            if (!content) return;
            data.push({
                name: cleanText(e.select('h3').first().text()) || '匿名',
                content: content,
                description: cleanText(e.select('span:not(.number)').first().text())
            });
        });

        var hasNext = isTrue(json.data.hasNext) && doc.select('li').size() > 0;
        return Response.success(data, hasNext ? (page + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
