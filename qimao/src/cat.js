load('crypto.js');
load('config.js');
load('filter.js');
load('channel.js');

// Đủ 5 bộ lọc trong cấu hình. Hằng config được app tiêm vào dạng chuỗi; không khai lại các tên này bằng var/let/const.
function readFilters() {
    return {
        channel: channelFilter(),
        words: filterCode('words', typeof FILTER_WORDS !== 'undefined' ? FILTER_WORDS : ''),
        update: filterCode('update', typeof FILTER_UPDATE !== 'undefined' ? FILTER_UPDATE : ''),
        status: filterCode('status', typeof FILTER_STATUS !== 'undefined' ? FILTER_STATUS : ''),
        sort: filterCode('sort', typeof FILTER_SORT !== 'undefined' ? FILTER_SORT : '')
    };
}

// Danh sách truyện của trang 书库 theo phân loại, ghép đủ 5 bộ lọc trong cấu hình.
// input: "<category1>|<category2>" ("a" = tất cả).
function execute(input, page) {
    var pageNo = parseInt(page, 10) || 1;
    var parts = String(input || '').split('|');
    var category1 = parts[0] || 'a';
    var category2 = parts[1] || 'a';
    var filters = readFilters();
    try {
        var data = fetchWeb('/classify/book-list', {
            // Phân loại đã ngầm định kênh; ghép thêm kênh lọc khác kênh của phân loại sẽ ra 0 truyện.
            channel: category1 === 'a' ? filters.channel : 'a',
            category1: category1,
            category2: category2,
            words: filters.words,
            update_time: filters.update,
            is_vip: 'a',
            is_over: filters.status,
            order: filters.sort,
            page: String(pageNo)
        });
        var list = (data.book_list || []).filter(function (b) { return b && b.book_id; });
        var count = parseInt((data.page_data || {}).count, 10) || 0;
        var next = list.length >= WEB_PAGE_SIZE && pageNo * WEB_PAGE_SIZE < count ? String(pageNo + 1) : '';
        return Response.success(list.map(webBookItem), next);
    } catch (error) {
        return Response.error('Qimao: ' + error.message);
    }
}
