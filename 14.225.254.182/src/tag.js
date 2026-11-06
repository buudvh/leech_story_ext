load('common.js');
load('filter_host.js');
load('filter.js');
load('filter_sort.js');

// input: "cat:<mã thể loại>" | "tag:<slug>" | "rank:<mã sort>" (bảng xếp hạng của explore: mọi thể loại, sắp xếp cố
// định theo bảng); nguồn/số chương/loại/trạng thái (và sắp xếp, trừ "rank:") lấy từ cấu hình.
function execute(input, page) {
    page = parseInt(page, 10) || 1;
    var text = String(input || "");
    var category = "";
    var slug = "";
    var sortCode = null;
    if (text.indexOf("cat:") === 0) {
        category = text.substring(4).trim();
    } else if (text.indexOf("tag:") === 0) {
        slug = text.substring(4).trim();
    } else if (text.indexOf("rank:") === 0) {
        sortCode = text.substring(5).trim();
    }

    var result = stvFetchBooks(category, slug, page, sortCode);
    if (result.error) return Response.error(result.error);
    var results = result.results;
    return Response.success(results, results.length >= 48 ? String(page + 1) : null);
}
