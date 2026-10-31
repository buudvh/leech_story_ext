load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        var apiPage = parseInt(page || '1', 10) || 1;
        var data = [];
        var seen = {};
        var hasNext = false;
        // Trang lọc hết (toàn truyện thu phí/đã gỡ) thì đọc tiếp trang sau, tối đa 3 trang mỗi lượt.
        for (var i = 0; i < 3; i++) {
            url = BASE_URL + '/api/book/search?keyword=' + encodeURIComponent(key)
                + '&page=' + apiPage + '&psize=' + SEARCH_PAGE_SIZE;
            var response = fetch(url);
            if (!response.ok) throw new Error(`Status ${response.status}`);

            var json = response.json();
            if (!json || json.code != 0 || !json.data) throw new Error((json && json.msg) || 'Tìm kiếm lỗi');

            var list = json.data.list || [];
            data = data.concat(parseBookJson(list, seen));
            hasNext = list.length > 0 && apiPage * SEARCH_PAGE_SIZE < (parseInt(json.data.count, 10) || 0);
            apiPage++;
            if (data.length || !hasNext) break;
        }

        return Response.success(data, hasNext ? apiPage.toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
