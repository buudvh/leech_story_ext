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

// ---- Phân loại ----
// File này được mọi script nạp nên không nhắc tên ô cấu hình nào (nút Bộ lọc của tab hiện mọi ô mà script của tab và
// các file nó nạp nhắc tới): ô Phân loại 最近更新 / Sắp xếp đọc ở gen.js, ô Trạng thái ở ranking.js, ô bảng Trang chủ ở
// explore.js.

// Phân loại của trang (/novels/class): tên -> mã 0..10 (home.js dựng tab, gen.js tra mã). Chữ phải khớp `values` của ô
// Phân loại 最近更新 trong plugin.json.
var CLASSES = [
    ['全部分類', '0'], ['玄幻奇幻', '1'], ['武俠仙俠', '2'], ['現代都市', '3'], ['歷史軍事', '4'], ['科幻小說', '5'],
    ['遊戲競技', '6'], ['恐怖靈異', '7'], ['言情小說', '8'], ['動漫同人', '9'], ['其他類型', '10']
];

// Giá trị một ô cấu hình (hằng app tiêm vào dạng chuỗi, đọc bằng `typeof KEY !== 'undefined' ? KEY : ''` ở file cần) ->
// chuỗi đã bỏ khoảng trắng hai đầu.
function configText(value) {
    return value == null ? '' : String(value).trim();
}

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
