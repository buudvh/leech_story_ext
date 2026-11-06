load('libs.js');
load('config.js');
load('ranking.js');

// Kiểu sắp xếp của bảng xếp hạng: /novels/<kiểu>_<phân loại>_<0|1 全本>_<trang>.html. Tên theo trang sto9 (nút 人氣 /
// 推薦 / 新書, các kiểu khác là trang ẩn cùng mẫu URL, tên lấy theo tiêu đề trang).
var SORTS = {
    '人氣': 'weekvisit', '推薦': 'allvote', '新書': 'newhot', '日點擊榜': 'dayvisit', '月點擊榜': 'monthvisit',
    '總點擊榜': 'allvisit', '收藏榜': 'goodnum', '最新入庫': 'postdate', '最近更新': 'lastupdate',
    // Tên của v5–v6 (có ngoặc) — cấu hình đã lưu vẫn hiểu đúng.
    '人氣 (周點擊榜)': 'weekvisit', '推薦 (總推薦榜)': 'allvote', '新書 (新書榜)': 'newhot'
};

function classCode(name) {
    for (var i = 0; i < CLASSES.length; i++) {
        if (CLASSES[i][0] === name) return CLASSES[i][1];
    }
    return '0';
}

// URL một trang danh sách theo input của tab (hằng config được app tiêm vào dạng chuỗi; không khai lại các tên này):
// - "update"      : tab 最近更新, /novels/class/<phân loại của ô FILTER_UPDATE_CLASS>_<trang>.html;
// - "class:<mã>"  : tab phân loại, bảng xếp hạng theo ô Sắp xếp (FILTER_SORT) + Trạng thái. 新書 + 全本 trang không có
//                   dữ liệu (0–4 truyện) ⇒ dùng 最新入庫 + 全本;
// - "rank:<kiểu>" : một bảng xếp hạng của Trang chủ (explore, ranking.js);
// - còn lại       : URL tương đối kiểu cũ (`{0}` đã được app thay bằng số trang).
function listUrl(input, page) {
    if (input === 'update') {
        var className = configText(typeof FILTER_UPDATE_CLASS !== 'undefined' ? FILTER_UPDATE_CLASS : '');
        return BASE_URL + '/novels/class/' + classCode(className) + '_' + page + '.html';
    }
    var match = /^class:(\d+)$/.exec(input);
    if (match) {
        var sort = SORTS[configText(typeof FILTER_SORT !== 'undefined' ? FILTER_SORT : '')] || 'weekvisit';
        var full = statusFlag();
        if (sort === 'newhot' && full === '1') sort = 'postdate';
        return BASE_URL + '/novels/' + sort + '_' + match[1] + '_' + full + '_' + page + '.html';
    }
    match = /^rank:([a-z]+)$/.exec(input);
    if (match) return rankUrl(match[1], page);
    return String.format(BASE_URL + input, page);
}

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
