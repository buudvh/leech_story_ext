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

// Đọc ô cấu hình của bộ lọc nằm ở file riêng, để nút Bộ lọc của app chỉ hiện ô mà script của tab thật sự dùng (app dò
// tên ô trong script và các file nó load): filter.js (Số chương / Loại / Trạng thái + dựng danh sách), filter_sort.js
// (Sắp xếp). Script cần ô nào thì load file đó.

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
