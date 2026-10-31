load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        // Trang tìm tách tham số theo "_" và cần hậu tố .html (thiếu thì luôn về trang 1).
        var keyword = String(key || '').replace(/[_\/\\]/g, ' ').trim();
        url = BASE_URL + '/search/' + encodeURIComponent(keyword) + '_0_0_0_0_0_' + page + '.html';
        var response = fetch(url, { headers: PC_HEADERS, timeout: FETCH_TIMEOUT });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var props = ciyuanjiNextData(response).props;
        if (!props.list && props.totalCount == null) throw new Error('Trang tìm kiếm không có dữ liệu');

        var data = [];
        (props.list || []).forEach(function (e) {
            if (e && e.bookId) data.push(ciyuanjiBook(e));
        });

        var hasNext = data.length > 0 && parseInt(page, 10) * LIST_PAGE_SIZE < (parseInt(props.totalCount, 10) || 0);
        return Response.success(data, hasNext ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
