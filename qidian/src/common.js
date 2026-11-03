function toCapitalize(sentence) {
    var words = sentence.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.substring(1);
    }
    return words.join(" ");
}

function extractBookId(url, isSTV) {
    var match;
    if (isSTV) {
        match = url.match(/\/(\d+)\/?$/);
    } else {
        match = url.match(/\/(\d+)\.htm/);
    }
    if (!match) {
        throw new Error("Book ID not found in URL");
    }
    return match[1];
}

function text(doc, selector) {
    var el = $.Q(doc, selector);
    if (el && typeof el.text === 'function') {
        var t = el.text();
        if (typeof t === 'string') {
            return t.trim();
        }
    }
    return '';
}

function formatName(name) {
    var re = /^(\d+)\.第(\d+)章\s*/;
    var result = name.replace(re, '第$2章 ');

    var lastParenIndex = Math.max(result.lastIndexOf('('), result.lastIndexOf('（'));
    if (lastParenIndex !== -1) {
        result = result.slice(0, lastParenIndex);
    }

    var onlyBracket = /^第\d+章\s*【[^】]*】?\s*$/;
    if (onlyBracket.test(result)) {
        return result.trim();
    }

    result = result.replace(/【.*$/, '');

    return result.trim();
}

// Chữ của bộ lọc (giá trị config select) -> tham số trang tìm STV.
var FILTER_CODES = {
    sort: { "Không sắp xếp": "", "Mới nhập kho": "new", "Mới cập nhật": "update", "Lượt đọc tổng": "view", "Lượt đọc tuần": "viewweek", "Lượt đọc ngày": "viewday", "Lượt thích": "like", "Lượt theo dõi": "following", "Lượt đánh dấu": "bookmarked", "Đề cử": "auto" },
    minc: { "> 50": "50", "> 100": "100", "> 200": "200", "> 500": "500", "> 1000": "1000", "> 1500": "1500", "> 2000": "2000", "Tất cả": "0" },
    type: { "Tất cả": "", "Truyện sáng tác": "sangtac", "Truyện dịch": "dich", "Truyện tranh": "comic", "Txt dịch tự động": "txt", "Truyện scan ảnh": "scan" },
    step: { "Tất cả": "", "Hoàn thành": "3", "Còn tiếp": "1", "Tạm ngưng": "2", "Không tạm ngưng": "5" }
};
// Mã dùng khi chữ không có trong bảng (chưa cấu hình, hoặc chữ cũ của bản trước).
var FILTER_DEFAULTS = { sort: "update", minc: "0", type: "", step: "" };

function filterCode(group, label) {
    var table = FILTER_CODES[group];
    var key = (label == null ? "" : String(label)).trim();
    // Mã rỗng là hợp lệ ("Không sắp xếp", "Tất cả") nên tra theo khoá, không theo giá trị.
    if (table && Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    return FILTER_DEFAULTS[group];
}

// Ghép bộ lọc vào URL tìm STV giống createquery() của trang STV: mã rỗng thì bỏ tham số.
// `sortCode` (bảng xếp hạng của explore / "rank:<mã>") thay cho ô Sắp xếp; các ô khác vẫn theo cấu hình.
function buildFilterQuery(sortCode) {
    var sort = sortCode != null ? sortCode : filterCode("sort", typeof FILTER_SORT !== "undefined" ? FILTER_SORT : "");
    var minc = filterCode("minc", typeof FILTER_MIN_CHAPTER !== "undefined" ? FILTER_MIN_CHAPTER : "");
    var type = filterCode("type", typeof FILTER_TYPE !== "undefined" ? FILTER_TYPE : "");
    var step = filterCode("step", typeof FILTER_STATUS !== "undefined" ? FILTER_STATUS : "");
    var q = "&minc=" + minc;
    if (sort) q += "&sort=" + sort;
    if (type) q += "&type=" + type;
    if (step) q += "&step=" + step;
    return q;
}

// Một trang truyện qidian của STV (/io/searchtp/searchBooks, host=qidian) ⇒ { url, items } | { url, error }.
// Dùng chung cho tag.js và explore.js.
function qidianFetchBooks(category, slug, page, sortCode) {
    var url = STVHOST + '/io/searchtp/searchBooks/?find=&host=qidian' + (category ? '&category=' + category : '') +
        buildFilterQuery(sortCode) + '&tag=' + (slug ? slug + ',' : '') + '&p=' + page;
    var response = fetch(url);
    if (!response.ok) return { url: url, error: 'fetch ' + url + ' failed: status ' + response.status };
    var items = [];
    response.html().select("a.booksearch").forEach(function (e) {
        // `e` chính là thẻ a.booksearch: đọc thẳng href (select("a") chỉ tự khớp chính nó ở SwiftSoup, không ở mọi DOM).
        var bookid = (e.attr("href") || e.select("a").first().attr("href")).split("/")[4];
        items.push({
            name: toCapitalize(e.select(".searchbooktitle").first().text()),
            link: STVHOST + "/truyen/qidian/1/" + bookid + "/",
            cover: e.select("img").attr("src") || DEFAULT_COVER,
            description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                + "\n" + e.select("div > span.lhr").last().text()
        });
    });
    return { url: url, items: items };
}

// Bảng xếp hạng của Trang chủ (explore.js): tên hàng + mã `sort` của STV. Bỏ Không sắp xếp / Mới nhập kho / Mới cập
// nhật (không phải bảng xếp hạng).
var QIDIAN_RANKINGS = [
    ["Lượt đọc tổng", "view"], ["Lượt đọc tuần", "viewweek"], ["Lượt đọc ngày", "viewday"], ["Lượt thích", "like"],
    ["Lượt theo dõi", "following"], ["Lượt đánh dấu", "bookmarked"], ["Đề cử", "auto"]
];

// Chép đúng slugVietnamese() của trang STV (giá trị data-t của nhãn).
function slugVietnamese(string) {
    string = string.toLowerCase();
    string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    string = string.replace(/đ/g, "d");
    string = string.replace(/\W+/g, "");
    string = string.trim();
    return string;
}

// Viết hoa chữ cái đầu mỗi từ.
function titleCase(s) {
    return String(s || "").split(" ").map(function (w) {
        return w.charAt(0).toUpperCase() + w.substring(1);
    }).join(" ");
}
