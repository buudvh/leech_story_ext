load('libs.js');
load('config.js');

// input: classify_id (API phân loại, nhiều trang) hoặc đường dẫn trang HTML "/l/..." (một trang).
function execute(input, page) {
    var url;
    try {
        input = String(input || '');
        if (input.startsWith('/')) return htmlList(input, page);

        // page = số trang API bắt đầu của lượt này.
        var apiPage = parseInt(page || '1', 10) || 1;
        var data = [];
        var seen = {};
        var hasNext = false;
        var fetched = 0;
        // Đọc CLASSIFY_PAGES_PER_LOAD trang; nếu lọc hết thì đọc thêm (tối đa gấp 3) để không trả trang rỗng giữa chừng.
        while (fetched < CLASSIFY_PAGES_PER_LOAD * 3) {
            url = BASE_URL + '/api/book/classify?site_id=&classify_id=' + encodeURIComponent(input) + '&page=' + apiPage;
            var response = fetch(url);
            if (!response.ok) {
                if (fetched > 0) { hasNext = true; break; }
                throw new Error(`Status ${response.status}`);
            }

            var json = response.json();
            if (!json || json.code != 0 || !json.data) throw new Error((json && json.msg) || 'Danh sách lỗi');

            var list = json.data.list || [];
            data = data.concat(parseBookJson(list, seen));
            fetched++;
            hasNext = list.length > 0 && apiPage * CLASSIFY_PAGE_SIZE < (parseInt(json.data.count, 10) || 0);
            apiPage++;
            if (!hasNext) break;
            if (fetched >= CLASSIFY_PAGES_PER_LOAD && data.length) break;
        }

        if (!data.length && !hasNext && (page || '1') == '1') throw new Error('Length = 0');

        return Response.success(data, hasNext ? apiPage.toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}

// Trang 精选/推荐 chỉ có một trang (trang 2 trả lại cùng danh sách xáo thứ tự).
function htmlList(path, page) {
    var url = BASE_URL + path;
    try {
        if (page && page != '1') return Response.success([], '');

        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var data = parseBookHtml(response.html());
        if (!data.length) throw new Error('Length = 0');

        return Response.success(data, '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
