load('common.js');

// input: "cat:<mã thể loại>" | "tag:<slug>"; nguồn/sắp xếp/số chương/loại/trạng thái lấy từ cấu hình.
function execute(input, page) {
    page = parseInt(page, 10) || 1;
    var text = String(input || "");
    var category = "";
    var slug = "";
    if (text.indexOf("cat:") === 0) {
        category = text.substring(4).trim();
    } else if (text.indexOf("tag:") === 0) {
        slug = text.substring(4).trim();
    }
    var tagPart = slug ? slug + "," : "";

    var url = stvBase() + '/io/searchtp/searchBooks/?find=' + (category ? '&category=' + category : '') +
        buildFilterQuery() + '&tag=' + tagPart + '&p=' + page;

    // Gọi như trang STV (giống homecontent.js)
    var response = fetch(url, {
        method: "POST",
        headers: {
            "Referer": stvBase() + "/",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": STV_UA,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "ignores="
    });
    if (!response.ok) {
        return Response.error("Url: " + url + "\nStatus: " + response.status);
    }

    var results = stvParseBooks(response.html());
    return Response.success(results, results.length >= 48 ? String(page + 1) : null);
}
