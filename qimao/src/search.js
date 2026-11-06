load('crypto.js');
load('config.js');
load('filter.js');

// Tìm qua API app (xếp hạng tốt hơn bản web, bản web còn bỏ qua mọi bộ lọc). API này chỉ có:
// số chữ (ngưỡng một phía), hoàn thành, và xếp theo tổng số chữ; kênh và thời gian cập nhật không áp được.
// Mã số chữ của trang 书库 -> [mã `words` của API tìm, cận trên lọc tại chỗ (0 = không)].
var SEARCH_WORDS = { '1': ['2', 0], '2': ['4', 500000], '3': ['5', 1000000], '4': ['6', 2000000], '5': ['7', 0] };
// Lọc cận trên có thể làm rỗng một trang ⇒ đọc thêm tối đa vài trang cho tới khi có kết quả.
var SEARCH_MAX_PAGES = 3;

// Chỉ các ô API tìm áp được (số chữ, tình trạng, sắp xếp). Hằng config được app tiêm vào dạng chuỗi.
function searchFilters() {
    return {
        words: filterCode('words', typeof FILTER_WORDS !== 'undefined' ? FILTER_WORDS : ''),
        status: filterCode('status', typeof FILTER_STATUS !== 'undefined' ? FILTER_STATUS : ''),
        sort: filterCode('sort', typeof FILTER_SORT !== 'undefined' ? FILTER_SORT : '')
    };
}

function searchParams(key, pageNo, filters) {
    var params = { gender: '3', imei_ip: IMEI_IP, page: String(pageNo), wd: key };
    var words = SEARCH_WORDS[filters.words];
    if (words) params.words = words[0];
    if (filters.status === '1') params.update_status = '1';
    else if (filters.status === '0') params.update_status = '3';
    if (filters.sort === 'words_num') params.collation_rule = '3';
    return params;
}

function searchItem(book) {
    var intro = shortIntro(book.intro);
    return {
        name: cleanText(book.original_title || book.title),
        link: bookUrl(book.id),
        cover: coverOf(book.image_link),
        description: joinInfo([book.original_author || book.author, subTitleInfo(book.sub_title)]) + (intro ? '\n' + intro : ''),
        host: BASE_URL
    };
}

function execute(key, page) {
    key = String(key || '').trim();
    if (!key) return Response.success([], '');
    var pageNo = parseInt(page, 10) || 1;
    var filters = searchFilters();
    var limit = (SEARCH_WORDS[filters.words] || [])[1] || 0;
    try {
        for (var round = 0; round < SEARCH_MAX_PAGES; round++) {
            var data = fetchApp(APP_BC, '/search/v1/words', searchParams(key, pageNo, filters));
            var books = data.books || [];
            var items = books.filter(function (book) {
                // show_type 2/4 là thẻ tác giả/chủ đề, không phải truyện.
                if (!book || !book.id || book.show_type == 2 || book.show_type == 4) return false;
                return !limit || (parseInt(book.words_num, 10) || 0) < limit;
            }).map(searchItem);
            var nextPage = parseInt((data.meta || {}).next_page, 10) || 0;
            var next = books.length && nextPage > pageNo ? String(nextPage) : '';
            if (items.length || !next) return Response.success(items, next);
            pageNo = nextPage;
        }
        return Response.success([], String(pageNo));
    } catch (error) {
        return Response.error('Qimao: ' + error.message);
    }
}
