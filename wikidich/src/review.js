load('config.js');

// Tab Review: truyện có bài review, một truyện mỗi bài, bỏ trùng trong trang (mỗi bài có hai bản HTML: điện thoại và
// máy tính). Trang chỉ lọc theo giới tính (`cat`, chung ô Giới tính) và xếp Mới nhất / Cũ nhất (ô Xếp review).
function execute(url, page) {
    if (!page) page = '0';
    url = String(url || '/review');
    if (url.indexOf('http') !== 0) url = BASE_URL + url;
    var params = [];
    var cat = filterCode('FILTER_GENDER');
    if (cat && !hasParam(url, 'cat')) params.push('cat=' + cat);
    var order = REVIEW_SORTS[configValue('FILTER_REVIEW_SORT')] || '';
    if (order && !hasParam(url, 'order')) params.push('order=' + order);
    if (params.length) url += (url.indexOf('?') < 0 ? '?' : '&') + params.join('&');

    var result = fetchPage(url, { method: 'GET', queries: { start: page } }, '#commentList');
    if (result.error) return Response.error(result.error);
    var doc = result.doc;

    var data = [];
    var seen = {};
    doc.select('#commentList > .review-group').forEach(function (group) {
        var items = group.select('.book-item');
        if (items.size() === 0) return;
        var e = items.get(0);
        var link = e.select('a.book-cover').attr('href') || e.select('a.book-title').attr('href');
        if (!link || seen[link]) return;
        seen[link] = true;
        data.push({
            name: e.select('.book-title').text(),
            link: link,
            cover: e.select('.book-cover img').attr('src'),
            description: e.select('.book-author').text(),
            host: BASE_URL
        });
    });

    return Response.success(data, nextStart(doc));
}
