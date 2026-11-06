load('libs.js');
load('config.js');
load('ranking.js');

// Bảng xếp hạng của Trang chủ (ô EXPLORE_RANK): tên theo tiêu đề trang 101kks + kiểu URL. Giữ 新書 (tiện ích có tab
// 新书 từ trước); bỏ 最新入庫, 最近更新 (không phải bảng xếp hạng lượt đọc, có tab 最近更新 riêng).
var RANKINGS = [
    ['人氣', 'weekvisit'], ['推薦', 'allvote'], ['新書', 'newhot'], ['日點擊榜', 'dayvisit'], ['月點擊榜', 'monthvisit'],
    ['總點擊榜', 'allvisit'], ['收藏榜', 'goodnum']
];

// Kiểu hiển thị bảng của Trang chủ (ô EXPLORE_LAYOUT) -> `type` của section.
var EXPLORE_LAYOUTS = { 'Xếp hạng (đánh số)': 'ranking', 'Danh sách': 'list', 'Lưới': 'grid', 'Hàng ngang': 'horizontal_list' };

// Trang chủ: hàng chip "Bảng khác" (các bảng không chọn, bấm mở đủ bảng qua gen.js "rank:<kiểu>") rồi bảng đang chọn ở
// ô "Bảng xếp hạng Trang chủ" (EXPLORE_RANK), cả trang đầu, kiểu hiển thị theo ô EXPLORE_LAYOUT (mặc định ranking).
// 全部分類, Trạng thái theo cấu hình. Chỉ tải một bảng.
function execute() {
    var picked = configText(typeof EXPLORE_RANK !== 'undefined' ? EXPLORE_RANK : '');
    var chosen = RANKINGS[0];
    RANKINGS.forEach(function (rank) {
        if (rank[0] === picked) chosen = rank;
    });
    var layout = EXPLORE_LAYOUTS[configText(typeof EXPLORE_LAYOUT !== 'undefined' ? EXPLORE_LAYOUT : '')] || 'ranking';

    var url = rankUrl(chosen[1], '1');
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
