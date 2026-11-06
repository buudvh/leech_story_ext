load('config.js');
load('gender.js');
load('filter.js');

// Danh sách truyện: tab Home, thể loại / nhãn, cùng tác giả. URL /tim-kiem được ghép bộ lọc của Cấu hình; trang bắt
// đăng nhập ⇒ báo lỗi để người dùng mở link lỗi đăng nhập.
function execute(url, page) {
    if (!page) page = '0';
    var target = applyFilters(url);
    var queries = { start: page };
    if (!hasParam(target, 'vo')) queries.vo = 1;
    var result = fetchPage(target, { method: 'GET', queries: queries }, '.book-list');
    if (result.error) return Response.error(result.error);
    return Response.success(parseBookList(result.doc), nextStart(result.doc));
}
