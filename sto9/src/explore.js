load('libs.js');
load('config.js');

// Trang chủ: hàng chip "Bảng khác" (các bảng không chọn, bấm mở đủ bảng qua gen.js "rank:<kiểu>") rồi bảng đang chọn ở
// ô "Bảng xếp hạng Trang chủ" (EXPLORE_RANK), cả trang đầu, kiểu hiển thị theo ô EXPLORE_LAYOUT (mặc định ranking).
// 全部分類, Trạng thái theo cấu hình. Chỉ tải một bảng.
function execute() {
    var picked = configText('EXPLORE_RANK');
    var chosen = RANKINGS[0];
    RANKINGS.forEach(function (rank) {
        if (rank[0] === picked) chosen = rank;
    });
    var layout = EXPLORE_LAYOUTS[configText('EXPLORE_LAYOUT')] || 'ranking';

    var url = listUrl('rank:' + chosen[1], '1');
    var response = crawler.get(url);
    if (!response.ok) return Response.error('Url ' + url + '\nStatus ' + response.status);
    // App không lọc giúp mục của explore: bỏ mục không tên và trùng link.
    var seen = {};
    var items = parseNovelList(response.html()).filter(function (item) {
        if (!item.name || seen[item.link]) return false;
        seen[item.link] = true;
        return true;
    });

    var chips = RANKINGS.filter(function (rank) { return rank !== chosen; }).map(function (rank) {
        return { name: rank[0], action: { type: 'list', name: rank[0], script: 'gen.js', input: 'rank:' + rank[1] } };
    });
    var sections = [{ id: 'other_ranks', title: 'Bảng khác', type: 'chip', items: chips }];
    if (items.length) {
        sections.push({
            id: 'rank_' + chosen[1],
            title: 'Bảng xếp hạng (' + chosen[0] + ')',
            type: layout,
            items: items,
            more: { type: 'list', name: chosen[0], script: 'gen.js', input: 'rank:' + chosen[1] }
        });
    }
    return Response.success(sections);
}
