load('libs.js');
load('config.js');

// Trang chủ: các bảng xếp hạng của sto9 (`RANKINGS`), mỗi bảng một hàng ngang = cả trang đầu (全部分類, Trạng thái
// theo cấu hình). "Xem thêm" mở đủ bảng qua gen.js ("rank:<kiểu>"). Một bảng lỗi chỉ mất hàng đó. App chưa tải section
// riêng ⇒ các bảng tải lần lượt trong một lượt.
function execute() {
    var sections = [];
    RANKINGS.forEach(function (rank) {
        var items = [];
        try {
            var response = crawler.get(listUrl('rank:' + rank[1], '1'));
            if (!response.ok) {
                console.log('sto9 explore ' + rank[1] + ': status ' + response.status);
                return;
            }
            items = parseNovelList(response.html());
        } catch (error) {
            console.log('sto9 explore ' + rank[1] + ': ' + error.message);
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
            more: { type: 'list', name: rank[0], script: 'gen.js', input: 'rank:' + rank[1] }
        });
    });
    return Response.success(sections);
}
