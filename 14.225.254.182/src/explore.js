load('common.js');

// Trang chủ: các bảng xếp hạng của STV (`STV_RANKINGS`), mỗi bảng một hàng ngang = cả trang đầu (mọi thể loại; nguồn,
// số chương, loại, trạng thái theo cấu hình). "Xem thêm" mở đủ bảng qua tag.js ("rank:<mã>"). Một bảng lỗi chỉ mất
// hàng đó. App chưa tải section riêng ⇒ các bảng tải lần lượt trong một lượt.
function execute() {
    var sections = [];
    STV_RANKINGS.forEach(function (rank) {
        var items = [];
        try {
            var result = stvFetchBooks("", "", 1, rank[1]);
            if (result.error) {
                console.log("STV explore " + rank[1] + ": " + result.error);
                return;
            }
            items = result.results;
        } catch (error) {
            console.log("STV explore " + rank[1] + ": " + error.message);
            return;
        }
        if (!items.length) return;
        sections.push({
            id: "rank_" + rank[1],
            title: rank[0],
            type: "horizontal_list",
            items: items,
            more: { type: "list", name: rank[0], script: "tag.js", input: "rank:" + rank[1] }
        });
    });
    return Response.success(sections);
}
