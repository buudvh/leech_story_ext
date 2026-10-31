load('libs.js');
load('config.js');

// input: "<phân loại>_<số chữ>_<tình trạng>_<thu phí>_<sắp xếp>" (thư viện) hoặc "tag_<tagId>" (thẻ).
function execute(input, page) {
    var url;
    try {
        page = page || '1';
        var isTag = String(input).indexOf('tag_') == 0;
        // Thiếu hậu tố .html thì trang luôn trả trang 1.
        url = isTag
            ? BASE_URL + '/tags/' + input.substring(4) + '_' + page + '.html'
            : BASE_URL + '/l_c_' + input + '_' + page + '_' + LIST_PAGE_SIZE + '.html';
        var response = fetch(url, { headers: PC_HEADERS, timeout: FETCH_TIMEOUT });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var props = ciyuanjiNextData(response).props;
        var box = isTag ? props.bookData : props.libraryListData;
        if (!box) throw new Error('Trang danh sách không có dữ liệu');

        var data = [];
        (box.list || []).forEach(function (e) {
            if (e && e.bookId) data.push(ciyuanjiBook(e));
        });

        if (!data.length) {
            if (page == '1') throw new Error('Length = 0');
            return Response.success([], '');
        }

        var size = isTag ? TAG_PAGE_SIZE : LIST_PAGE_SIZE;
        var hasNext = parseInt(page, 10) * size < (parseInt(box.totalCount, 10) || 0);
        return Response.success(data, hasNext ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
