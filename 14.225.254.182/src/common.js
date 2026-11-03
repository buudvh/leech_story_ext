var STV_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function stvBase() {
    var base = (typeof BASE_URL !== 'undefined' && BASE_URL) ? String(BASE_URL) : "http://14.225.254.182";
    return base.replace(/\/+$/, "");
}

function stvAbsolute(link) {
    link = (link || "").trim();
    if (!link) return "";
    if (link.indexOf("//") === 0) return "https:" + link;
    if (link.indexOf("http://") === 0 || link.indexOf("https://") === 0) return link;
    return stvBase() + (link.charAt(0) === "/" ? link : "/" + link);
}

// Danh sách truyện của /io/searchtp/searchBooks (Home, thể loại, tìm kiếm, cùng tác giả)
function stvParseBooks(doc) {
    var links = doc.select("a.booksearch");
    if (links.size() === 0) {
        links = doc.select("a.cap");
    }

    var results = [];
    var seen = {};
    for (var i = 0; i < links.size(); i++) {
        var item = links.get(i);
        var href = item.attr("href");
        if (!href || !/\/truyen\/[^\/]+\/1\/[^\/]+/.test(href)) continue;

        var link = stvAbsolute(href);
        if (seen[link]) continue;
        seen[link] = true;

        var name = item.select(".searchbooktitle").text().trim();
        if (!name) name = item.select("b").text().trim();
        if (!name) name = item.text().trim();

        // searchtag thứ nhất là nguồn (qidian…), thứ hai là trạng thái (Còn Tiếp / Hoàn Thành)
        var tags = item.select("span.searchtag");
        var sourceHost = tags.size() > 0 ? tags.get(0).text().trim() : "";
        var status = tags.size() > 1 ? tags.get(1).text().trim() : "";
        var summary = item.select("span[style*=font-size]").text().trim();

        results.push({
            name: name,
            author: item.select(".searchbookauthor").text().trim() || "Không rõ",
            description: (sourceHost ? "[" + sourceHost + "] " : "") + summary,
            tag: status,
            cover: stvAbsolute(item.select("img").attr("src")),
            link: link,
            host: stvBase()
        });
    }
    return results;
}

function tag(title, host, sort, tag) {
    var input = stvBase() + "/io/searchtp/searchBooks?find=&host=" + host + "&minc=0&sort=" + sort + "&tag=" + tag + "&p={0}";
    return { title: title, input: input, script: "homecontent.js" };
}

// Chữ của bộ lọc (giá trị config select) -> tham số trang tìm STV.
var FILTER_CODES = {
    // Chọn nguồn nhanh (#quickhostselector của trang tìm STV, đã bỏ nguồn [Dead]).
    host: {
        "Tất cả nguồn": "",
        "[Free] 69shu": "69shu",
        "[Vip] faloo (Phi Lư): Sảng văn": "faloo",
        "[Vip] qidian (Khởi Điểm): Tổng hợp": "qidian",
        "[Vip] fanqie (Cà Chua): Sảng văn, Tổng hợp": "fanqie",
        "[Vip] ciweimao: Đồng nhân, Tổng hợp": "ciweimao",
        "[Vip] jjwxc (Tấn Giang): Ngôn đam": "jjwxc",
        "[Vip] sfacg: Biến thân": "sfacg",
        "[Free] tadu: Ngôn sảng": "tadu",
        "[Free] qimao (7 Mèo): Ngôn sảng": "qimao",
        "[Free] idejian (Chưởng Duyệt)": "idejian",
        "[Vip] zongheng (Tung Hoành)": "zongheng",
        "[LN] linovel": "linovel",
        "[LN] wenku8": "wenku8",
        "[Free] 69shuorg": "69shuorg",
        "[Free] ddxs": "ddxs",
        "[Free] ptwxz": "ptwxz",
        "[Free] shu05": "shu05",
        "[Free] qinqinxsw": "qinqinxsw",
        "[Free] wanbentxt": "wanbentxt",
        "[Free] 8zwdu": "8zwdu",
        "[Free] duanqingsi": "duanqingsi",
        "[Free] qiuxiaoshuo": "qiuxiaoshuo",
        "[Free] trxs": "trxs",
        "[Free] paoshu8": "paoshu8",
        "[Free] shumilou": "shumilou",
        "[Free] hetushu": "hetushu",
        "[Free] nofff": "nofff",
        "[Free] uuxs": "uuxs",
        "[Free] ranwenla": "ranwenla",
        "[Free] shumiloutw": "shumiloutw",
        "[Free] 66wx": "66wx",
        "[Free] biqugexs": "biqugexs",
        "[Free] zwdu": "zwdu",
        "[Free] xingeweb": "xingeweb",
        "[Free] qiushubang": "qiushubang",
        "[Free] xinshuhaige": "xinshuhaige",
        "[Free] oldtimescc": "oldtimescc",
        "[Free] wuwuxs": "wuwuxs",
        "[Free] hs313": "hs313",
        "[Free] shubao45": "shubao45",
        "[Free] biquge": "biquge",
        "[Free] uukanshu (UU)": "uukanshu"
    },
    sort: { "Không sắp xếp": "", "Mới nhập kho": "new", "Mới cập nhật": "update", "Lượt đọc tổng": "view", "Lượt đọc tuần": "viewweek", "Lượt đọc ngày": "viewday", "Lượt thích": "like", "Lượt theo dõi": "following", "Lượt đánh dấu": "bookmarked", "Đề cử": "auto" },
    minc: { "> 50": "50", "> 100": "100", "> 200": "200", "> 500": "500", "> 1000": "1000", "> 1500": "1500", "> 2000": "2000", "Tất cả": "0" },
    type: { "Tất cả": "", "Truyện sáng tác": "sangtac", "Truyện dịch": "dich", "Truyện tranh": "comic", "Txt dịch tự động": "txt", "Truyện scan ảnh": "scan" },
    step: { "Tất cả": "", "Hoàn thành": "3", "Còn tiếp": "1", "Tạm ngưng": "2", "Không tạm ngưng": "5" }
};
// Mã dùng khi chữ không có trong bảng (chưa cấu hình, hoặc chữ cũ của bản trước).
var FILTER_DEFAULTS = { host: "", sort: "update", minc: "0", type: "", step: "" };

function filterCode(group, label) {
    var table = FILTER_CODES[group];
    var key = (label == null ? "" : String(label)).trim();
    // Mã rỗng là hợp lệ ("Không sắp xếp", "Tất cả") nên tra theo khoá, không theo giá trị.
    if (table && Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    return FILTER_DEFAULTS[group];
}

// Mã nguồn đang chọn ở cấu hình; rỗng = tất cả nguồn.
function filterHost() {
    return filterCode("host", typeof FILTER_HOST !== "undefined" ? FILTER_HOST : "");
}

// Ghép bộ lọc vào URL tìm STV giống createquery() của trang STV: mã rỗng thì bỏ tham số.
// `sortCode` (bảng xếp hạng của explore / "rank:<mã>") thay cho ô Sắp xếp; các ô khác vẫn theo cấu hình.
function buildFilterQuery(sortCode) {
    var host = filterHost();
    var sort = sortCode != null ? sortCode : filterCode("sort", typeof FILTER_SORT !== "undefined" ? FILTER_SORT : "");
    var minc = filterCode("minc", typeof FILTER_MIN_CHAPTER !== "undefined" ? FILTER_MIN_CHAPTER : "");
    var type = filterCode("type", typeof FILTER_TYPE !== "undefined" ? FILTER_TYPE : "");
    var step = filterCode("step", typeof FILTER_STATUS !== "undefined" ? FILTER_STATUS : "");
    var q = "";
    if (host) q += "&host=" + host;
    q += "&minc=" + minc;
    if (sort) q += "&sort=" + sort;
    if (type) q += "&type=" + type;
    if (step) q += "&step=" + step;
    return q;
}

// Một trang truyện của /io/searchtp/searchBooks (gọi như trang STV, giống homecontent.js) ⇒ { results } | { error }.
// Dùng chung cho tag.js và explore.js.
function stvFetchBooks(category, slug, page, sortCode) {
    var url = stvBase() + '/io/searchtp/searchBooks/?find=' + (category ? '&category=' + category : '') +
        buildFilterQuery(sortCode) + '&tag=' + (slug ? slug + "," : "") + '&p=' + page;
    var response = fetch(url, {
        method: "POST",
        headers: {
            "Referer": stvBase() + "/",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": STV_UA,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "ignores="
    });
    if (!response.ok) return { error: "Url: " + url + "\nStatus: " + response.status };
    return { results: stvParseBooks(response.html()) };
}

// Bảng xếp hạng của Trang chủ (explore.js): tên hàng + mã `sort` của STV. Bỏ Không sắp xếp / Mới nhập kho / Mới cập
// nhật (không phải bảng xếp hạng).
var STV_RANKINGS = [
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
