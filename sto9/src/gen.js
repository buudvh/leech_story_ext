load('libs.js');
load('config.js');

// Danh sách truyện: tab 最近更新 ("update"), tab phân loại ("class:<mã>", theo bộ lọc), bảng xếp hạng của Trang chủ
// ("rank:<kiểu>") và URL kiểu cũ.
function execute(input, page) {
    var url;
    try {
        page = page || '1';
        url = listUrl(String(input || ''), page);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var data = parseNovelList(doc);

        // Hết trang ⇒ danh sách rỗng, không báo lỗi (app hiện "Đã hết").
        return Response.success(data, nextPageOf(doc, page, data.length));
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
