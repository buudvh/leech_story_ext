load('common.js');

function execute(query, page) {
    page = parseInt(page, 10) || 1;
    var url = stvBase() + "/io/searchtp/searchBooks/?find=&findinname=" + encodeURIComponent(query || "") + "&minc=0&sort=update&tag=&p=" + page;

    var response = fetch(url);
    if (!response.ok) {
        return Response.error("Url: " + url + "\nStatus: " + response.status);
    }

    // Không có kết quả / quá trang cuối ⇒ danh sách rỗng, không báo lỗi
    var results = stvParseBooks(response.html());
    return Response.success(results, results.length >= 48 ? String(page + 1) : "");
}
