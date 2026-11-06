load('config.js');
load('gender.js');

// Trang Review (/review) chỉ lọc theo giới tính (`cat`, cùng mã) và xếp Mới nhất / Cũ nhất (ô FILTER_REVIEW_SORT).
var REVIEW_SORTS = { 'Mới nhất': '', 'Cũ nhất': 'oldest' };

// Tab Review: truyện có bài review, một mục mỗi bài (mỗi bài có hai bản HTML: điện thoại và máy tính ⇒ lấy bản đầu).
// Không tự bỏ truyện trùng: app tự lọc trùng khi hiện, còn đếm số mục thô của trang (< 10 ⇒ coi như hết trang) nên
// bỏ trùng ở đây làm trang 10 bài còn 9 mục là dừng. Trang chỉ lọc theo giới tính (`cat`, chung ô Giới tính) và xếp
// Mới nhất / Cũ nhất (ô Xếp review).
function execute(url, page) {
    if (!page) page = '0';
    url = String(url || '/review');
    if (url.indexOf('http') !== 0) url = BASE_URL + url;
    var params = [];
    var cat = genderCode();
    if (cat && !hasParam(url, 'cat')) params.push('cat=' + cat);
    var order = REVIEW_SORTS[configText(typeof FILTER_REVIEW_SORT !== 'undefined' ? FILTER_REVIEW_SORT : '')] || '';
    if (order && !hasParam(url, 'order')) params.push('order=' + order);
    if (params.length) url += (url.indexOf('?') < 0 ? '?' : '&') + params.join('&');

    var result = fetchPage(url, { method: 'GET', queries: { start: page } }, '#commentList');
    if (result.error) return Response.error(result.error);
    var doc = result.doc;

    var data = [];
    doc.select('#commentList > .review-group').forEach(function (group) {
        var items = group.select('.book-item');
        if (items.size() === 0) return;
        var e = items.get(0);
        var link = e.select('a.book-cover').attr('href') || e.select('a.book-title').attr('href');
        if (!link) return;
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
