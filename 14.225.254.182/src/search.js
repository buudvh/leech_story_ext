load('common.js');
load('filter_host.js');
load('filter.js');
load('filter_sort.js');

function execute(query, page) {
    page = parseInt(page, 10) || 1;
    // Nguồn/sắp xếp/số chương/loại/trạng thái lấy từ cấu hình
    var url = stvBase() + "/io/searchtp/searchBooks/?find=&findinname=" + encodeURIComponent(query || "") + buildFilterQuery() + "&tag=&p=" + page;

    var response = fetch(url);
    if (!response.ok) {
        return Response.error("Url: " + url + "\nStatus: " + response.status);
    }

    // Không có kết quả / quá trang cuối ⇒ danh sách rỗng, không báo lỗi
    var results = stvParseBooks(response.html());
    return Response.success(results, results.length >= 48 ? String(page + 1) : "");
}
