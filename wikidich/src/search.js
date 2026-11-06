load('config.js');
load('gender.js');
load('filter.js');

// Tìm kiếm áp cả bộ lọc của Cấu hình (Giới tính "Tất cả" để tìm mọi loại truyện). Cần đăng nhập.
function execute(key, page) {
    if (!page) page = '0';
    var url = applyFilters(BASE_URL + '/tim-kiem?qs=1&vo=1');
    var result = fetchPage(url, { method: 'GET', queries: { q: key || '', start: page } }, '.book-list');
    if (result.error) return Response.error(result.error);
    return Response.success(parseBookList(result.doc), nextStart(result.doc));
}
