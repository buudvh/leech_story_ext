load('libs.js');
load('config.js');
load('ranking.js');

// Kiểu sắp xếp của bảng xếp hạng: /novels/<kiểu>_<phân loại>_<0|1 全本>_<trang>.html. Tên theo tiêu đề trang 101kks.
var SORTS = {
    '人氣': 'weekvisit', '推薦': 'allvote', '新書': 'newhot', '日點擊榜': 'dayvisit', '月點擊榜': 'monthvisit',
    '總點擊榜': 'allvisit', '收藏榜': 'goodnum', '最新入庫': 'postdate', '最近更新': 'lastupdate'
};

function classCode(name) {
    for (var i = 0; i < CLASSES.length; i++) {
        if (CLASSES[i][0] === name) return CLASSES[i][1];
    }
    return '0';
}

// URL một trang danh sách theo input của tab (hằng config được app tiêm vào dạng chuỗi; không khai lại các tên này):
// - "update"      : tab 最近更新 = bảng lastupdate theo ô Phân loại 最近更新 (FILTER_UPDATE_CLASS) + Trạng thái. Dùng bảng
//                   thay cho trang /novels/class (trang đó thiếu thẻ đóng của ảnh bìa);
// - "class:<mã>"  : tab phân loại, bảng xếp hạng theo ô Sắp xếp (FILTER_SORT) + Trạng thái;
// - "rank:<kiểu>" : một bảng xếp hạng của Trang chủ (explore, ranking.js);
// - còn lại       : URL tương đối kiểu cũ (`{0}` = số trang) — thể loại ở Chi tiết (DEFAULT_GEN) và tab cũ.
function listUrl(input, page) {
    if (input === 'update') {
        var className = configText(typeof FILTER_UPDATE_CLASS !== 'undefined' ? FILTER_UPDATE_CLASS : '');
        return BASE_URL + '/novels/lastupdate_' + classCode(className) + '_' + statusFlag() + '_' + page + '.html';
    }
    var match = /^class:(\d+)$/.exec(input);
    if (match) {
        var sort = SORTS[configText(typeof FILTER_SORT !== 'undefined' ? FILTER_SORT : '')] || 'weekvisit';
        return BASE_URL + '/novels/' + sort + '_' + match[1] + '_' + statusFlag() + '_' + page + '.html';
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
