load('libs.js');
load('common.js');

// Trang chủ: các bảng xếp hạng qidian của STV (`QIDIAN_RANKINGS`), mỗi bảng một hàng ngang = cả trang đầu (mọi thể
// loại; số chương, loại, trạng thái theo cấu hình). "Xem thêm" mở đủ bảng qua tag.js ("rank:<mã>"). Một bảng lỗi chỉ
// mất hàng đó. App chưa tải section riêng ⇒ các bảng tải lần lượt trong một lượt.
function execute() {
    var sections = [];
    QIDIAN_RANKINGS.forEach(function (rank) {
        var items = [];
        try {
            var result = qidianFetchBooks('', '', 1, rank[1]);
            if (result.error) {
                console.log('qidian explore ' + rank[1] + ': ' + result.error);
                return;
            }
            items = result.items;
        } catch (error) {
            console.log('qidian explore ' + rank[1] + ': ' + error.message);
            return;
        }
        // App không lọc giúp mục của explore: bỏ mục không tên và trùng link.
        var seen = {};
        items = items.filter(function (item) {
            if (!item.name || seen[item.link]) return false;
            seen[item.link] = true;
            return true;
        });
        if (!items.length) return;
        sections.push({
            id: 'rank_' + rank[1],
            title: rank[0],
            type: 'horizontal_list',
            items: items,
            more: { type: 'list', name: rank[0], script: 'tag.js', input: 'rank:' + rank[1] }
        });
    });
    return Response.success(sections);
}
