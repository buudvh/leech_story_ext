// Danh sách truyện có lọc: ô Số chương / Loại truyện / Trạng thái. Nạp ở explore.js, tag.js, search.js, cùng
// common.js và filter_host.js; ô Sắp xếp ở filter_sort.js (explore.js không nạp: bảng xếp hạng có mã sắp xếp riêng).

// Ghép bộ lọc vào URL tìm STV giống createquery() của trang STV: mã rỗng thì bỏ tham số.
// `sortCode` (bảng xếp hạng của explore / "rank:<mã>") thay cho ô Sắp xếp; null ⇒ ô Sắp xếp qua filterSort() của
// filter_sort.js (script không nạp file đó ⇒ mã mặc định như khi chưa cấu hình). Các ô khác vẫn theo cấu hình.
function buildFilterQuery(sortCode) {
    var host = filterHost();
    var sort = sortCode != null ? sortCode : (typeof filterSort === "function" ? filterSort() : FILTER_DEFAULTS.sort);
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
