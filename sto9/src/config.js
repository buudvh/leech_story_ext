var DEFAULT_GEN = [
    {"title": "其他类型", "input": "/novels/newhot_10_0_{0}.html", "script": "gen.js"},
    {"title": "动漫同人", "input": "/novels/newhot_9_0_{0}.html", "script": "gen.js"},
    {"title": "玄幻奇幻", "input": "/novels/newhot_1_0_{0}.html", "script": "gen.js"},
    {"title": "武侠仙侠", "input": "/novels/newhot_2_0_{0}.html", "script": "gen.js"},
    {"title": "现代都市", "input": "/novels/newhot_3_0_{0}.html", "script": "gen.js"},
    {"title": "歷史军事", "input": "/novels/newhot_4_0_{0}.html", "script": "gen.js"},
    {"title": "科幻小说", "input": "/novels/newhot_5_0_{0}.html", "script": "gen.js"},
    {"title": "游戏竞技", "input": "/novels/newhot_6_0_{0}.html", "script": "gen.js"},
    {"title": "恐怖灵异", "input": "/novels/newhot_7_0_{0}.html", "script": "gen.js"},
    {"title": "言情小说", "input": "/novels/newhot_8_0_{0}.html", "script": "gen.js"},
];

// ---- Phân loại + bộ lọc (config select) ----
// Phân loại của trang (/novels/class): tên -> mã 0..10. Chữ phải khớp `values` của FILTER_UPDATE_CLASS trong plugin.json.
var CLASSES = [
    ['全部分類', '0'], ['玄幻奇幻', '1'], ['武俠仙俠', '2'], ['現代都市', '3'], ['歷史軍事', '4'], ['科幻小說', '5'],
    ['遊戲競技', '6'], ['恐怖靈異', '7'], ['言情小說', '8'], ['動漫同人', '9'], ['其他類型', '10']
];

// Kiểu sắp xếp của bảng xếp hạng: /novels/<kiểu>_<phân loại>_<0|1 全本>_<trang>.html. Tên lấy theo tiêu đề trang của sto9;
// chỉ 人氣 / 推薦 / 新書 có nút trên trang, các kiểu khác là trang ẩn cùng mẫu URL.
var SORTS = {
    '人氣 (周點擊榜)': 'weekvisit', '推薦 (總推薦榜)': 'allvote', '新書 (新書榜)': 'newhot', '日點擊榜': 'dayvisit',
    '月點擊榜': 'monthvisit', '總點擊榜': 'allvisit', '收藏榜': 'goodnum', '最新入庫': 'postdate', '最近更新': 'lastupdate'
};

function configText(name) {
    var value = '';
    try {
        if (name === 'FILTER_UPDATE_CLASS' && typeof FILTER_UPDATE_CLASS !== 'undefined') value = FILTER_UPDATE_CLASS;
        else if (name === 'FILTER_SORT' && typeof FILTER_SORT !== 'undefined') value = FILTER_SORT;
        else if (name === 'FILTER_STATUS' && typeof FILTER_STATUS !== 'undefined') value = FILTER_STATUS;
    } catch (e) {}
    return value == null ? '' : String(value).trim();
}

function classCode(name) {
    for (var i = 0; i < CLASSES.length; i++) {
        if (CLASSES[i][0] === name) return CLASSES[i][1];
    }
    return '0';
}

// URL một trang danh sách theo input của tab:
// - "update"     : tab 最近更新, /novels/class/<phân loại của ô FILTER_UPDATE_CLASS>_<trang>.html;
// - "class:<mã>" : tab phân loại, bảng xếp hạng theo ô Sắp xếp + Trạng thái. 新書 + 全本 trang không có dữ liệu
//                  (0–4 truyện) ⇒ dùng 最新入庫 + 全本;
// - còn lại      : URL tương đối kiểu cũ (`{0}` đã được app thay bằng số trang).
function listUrl(input, page) {
    if (input === 'update') {
        return BASE_URL + '/novels/class/' + classCode(configText('FILTER_UPDATE_CLASS')) + '_' + page + '.html';
    }
    var match = /^class:(\d+)$/.exec(input);
    if (match) {
        var sort = SORTS[configText('FILTER_SORT')] || 'weekvisit';
        var full = configText('FILTER_STATUS') === '全本' ? '1' : '0';
        if (sort === 'newhot' && full === '1') sort = 'postdate';
        return BASE_URL + '/novels/' + sort + '_' + match[1] + '_' + full + '_' + page + '.html';
    }
    // "rank:<kiểu>": một bảng xếp hạng của Trang chủ (explore) — 全部分類, kiểu cố định, Trạng thái theo cấu hình.
    match = /^rank:([a-z]+)$/.exec(input);
    if (match) {
        return BASE_URL + '/novels/' + match[1] + '_0_' + (configText('FILTER_STATUS') === '全本' ? '1' : '0') + '_' + page + '.html';
    }
    return String.format(BASE_URL + input, page);
}

// Bảng xếp hạng của Trang chủ (explore.js): tên theo tiêu đề trang của sto9 + kiểu URL. Bỏ 新書 (nút 連載 của trang trỏ
// tới đây), 最新入庫, 最近更新 (không phải bảng xếp hạng lượt đọc).
var RANKINGS = [
    ['人氣 (周點擊榜)', 'weekvisit'], ['推薦 (總推薦榜)', 'allvote'], ['日點擊榜', 'dayvisit'], ['月點擊榜', 'monthvisit'],
    ['總點擊榜', 'allvisit'], ['收藏榜', 'goodnum']
];

// Danh sách truyện của trang danh mục / xếp hạng (#article_list_content). Dùng chung cho gen.js và explore.js.
function parseNovelList(doc) {
    var data = [];
    doc.select("#article_list_content > li").forEach(function (e) {
        // Quá trang cuối trang vẫn trả một <li> trống ⇒ chỉ tính mục có link.
        if (!e.select("div.newnav > h3 > a").first().attr("href")) return;
        data.push({
            name: e.select("div.newnav > h3 > a").first().text().convertT2S() || e.select("div.newnav > h3 > a:nth-child(2)").first().text().convertT2S(),
            link: e.select("div.newnav > h3 > a").first().attr("href"),
            cover: e.select("a > img").first().attr("data-src") || DEFAULT_COVER,
            description: e.select("div.newnav > div.labelbox > label:nth-child(1) > a").first().text().convertT2S()
                + "\n" + e.select("div.newnav > ol").first().text().convertT2S(),
            host: BASE_URL
        });
    });
    return data;
}

// Trang kế: hết truyện ⇒ không còn. Nút ">>" trỏ tới trang hiện tại + 10 (tối đa là trang cuối) ⇒ trang hiện tại
// ≥ số của nó là trang cuối. Cần vì tìm kiếm quá trang cuối trả lại trang cuối thay vì danh sách rỗng.
function nextPageOf(doc, page, count) {
    if (!count) return null;
    var current = parseInt(page, 10) || 1;
    var last = 0;
    doc.select('a').forEach(function (a) {
        if (last || a.text().trim() !== '>>') return;
        var m = /(\d+)(?:\.html)?\/?$/.exec(a.attr('href') || '');
        if (m) last = parseInt(m[1], 10);
    });
    if (last && current >= last) return null;
    return String(current + 1);
}
