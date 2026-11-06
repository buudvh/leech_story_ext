// Danh sách truyện có lọc: ô Số chương / Loại truyện / Trạng thái. Nạp ở explore.js, tag.js, search.js, cùng
// common.js; ô Sắp xếp ở filter_sort.js (explore.js không nạp: bảng xếp hạng có mã sắp xếp riêng).

// Ghép bộ lọc vào URL tìm STV giống createquery() của trang STV: mã rỗng thì bỏ tham số.
// `sortCode` (bảng xếp hạng của explore / "rank:<mã>") thay cho ô Sắp xếp; null ⇒ ô Sắp xếp qua filterSort() của
// filter_sort.js (script không nạp file đó ⇒ mã mặc định như khi chưa cấu hình). Các ô khác vẫn theo cấu hình.
function buildFilterQuery(sortCode) {
    var sort = sortCode != null ? sortCode : (typeof filterSort === "function" ? filterSort() : FILTER_DEFAULTS.sort);
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
