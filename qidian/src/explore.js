load('libs.js');
load('common.js');

// Trang chủ: hàng chip "Bảng khác" (các bảng không chọn, bấm mở đủ bảng qua tag.js "rank:<mã>") rồi bảng đang chọn ở
// ô "Bảng xếp hạng Trang chủ" (EXPLORE_RANK), cả trang đầu, kiểu hiển thị theo ô EXPLORE_LAYOUT (mặc định ranking).
// Mọi thể loại; số chương, loại, trạng thái theo cấu hình. Chỉ tải một bảng.
var EXPLORE_LAYOUTS = { 'Xếp hạng (đánh số)': 'ranking', 'Danh sách': 'list', 'Lưới': 'grid', 'Hàng ngang': 'horizontal_list' };

function configText(value) {
    return value == null ? '' : String(value).trim();
}

function execute() {
    var picked = configText(typeof EXPLORE_RANK !== 'undefined' ? EXPLORE_RANK : '');
    var chosen = QIDIAN_RANKINGS[1];
    QIDIAN_RANKINGS.forEach(function (rank) {
        if (rank[0] === picked) chosen = rank;
    });
    var layout = EXPLORE_LAYOUTS[configText(typeof EXPLORE_LAYOUT !== 'undefined' ? EXPLORE_LAYOUT : '')] || 'ranking';

    var result = qidianFetchBooks('', '', 1, chosen[1]);
    if (result.error) return Response.error(result.error);
    // App không lọc giúp mục của explore: bỏ mục không tên và trùng link.
    var seen = {};
    var items = result.items.filter(function (item) {
        if (!item.name || seen[item.link]) return false;
        seen[item.link] = true;
        return true;
    });

    var chips = QIDIAN_RANKINGS.filter(function (rank) { return rank !== chosen; }).map(function (rank) {
        return { name: rank[0], action: { type: 'list', name: rank[0], script: 'tag.js', input: 'rank:' + rank[1] } };
    });
    var sections = [{ id: 'other_ranks', title: 'Bảng khác', type: 'chip', items: chips }];
    if (items.length) {
        sections.push({
            id: 'rank_' + chosen[1],
            title: 'Bảng xếp hạng (' + chosen[0] + ')',
            type: layout,
            items: items,
            more: { type: 'list', name: chosen[0], script: 'tag.js', input: 'rank:' + chosen[1] }
        });
    }
    return Response.success(sections);
}
