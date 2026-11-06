load('common.js');
load('filter_host.js');
load('filter.js');

// Trang chủ: hàng chip "Bảng khác" (các bảng không chọn, bấm mở đủ bảng qua tag.js "rank:<mã>") rồi bảng đang chọn ở
// ô "Bảng xếp hạng Trang chủ" (EXPLORE_RANK), cả trang đầu, kiểu hiển thị theo ô EXPLORE_LAYOUT (mặc định ranking).
// Mọi thể loại; nguồn, số chương, loại, trạng thái theo cấu hình. Chỉ tải một bảng.
var EXPLORE_LAYOUTS = { "Xếp hạng (đánh số)": "ranking", "Danh sách": "list", "Lưới": "grid", "Hàng ngang": "horizontal_list" };

function configText(value) {
    return value == null ? "" : String(value).trim();
}

function execute() {
    var picked = configText(typeof EXPLORE_RANK !== "undefined" ? EXPLORE_RANK : "");
    var chosen = STV_RANKINGS[1];
    STV_RANKINGS.forEach(function (rank) {
        if (rank[0] === picked) chosen = rank;
    });
    var layout = EXPLORE_LAYOUTS[configText(typeof EXPLORE_LAYOUT !== "undefined" ? EXPLORE_LAYOUT : "")] || "ranking";

    var result = stvFetchBooks("", "", 1, chosen[1]);
    if (result.error) return Response.error(result.error);

    var chips = STV_RANKINGS.filter(function (rank) { return rank !== chosen; }).map(function (rank) {
        return { name: rank[0], action: { type: "list", name: rank[0], script: "tag.js", input: "rank:" + rank[1] } };
    });
    var sections = [{ id: "other_ranks", title: "Bảng khác", type: "chip", items: chips }];
    if (result.results.length) {
        sections.push({
            id: "rank_" + chosen[1],
            title: "Bảng xếp hạng (" + chosen[0] + ")",
            type: layout,
            items: result.results,
            more: { type: "list", name: chosen[0], script: "tag.js", input: "rank:" + chosen[1] }
        });
    }
    return Response.success(sections);
}
