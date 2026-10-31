load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = BASE_URL + '/api/v1/search/list?keyWord=' + encodeURIComponent(key) + '&page=' + page;
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var json = response.json();
        if (!json || json.status != 100) throw new Error((json && json.msg) || 'Tìm kiếm lỗi');

        // API trả từ mục (page-1)*10 nhưng số mục tăng theo trang ⇒ chỉ lấy 10 mục đầu.
        var data = parseBookList(Html.parse(json.data.bookList || '')).slice(0, 10);

        var hasNext = isTrue(json.data.hasNext) && data.length > 0;
        return Response.success(data, hasNext ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
