load('libs.js');
load('config.js');

// Trang gom nhiều nguồn: một truyện có thể ra nhiều lần (mỗi nguồn một lần), nguồn ghi ở mô tả.
function execute(key, page) {
    var url = API_URL + '/search';
    try {
        page = page || '1';
        // API tìm song song trên các nguồn nên chậm.
        var data = mowanApi('/search', { keyword: key, page: page, page_size: SEARCH_PAGE_SIZE }, 60000) || {};
        var items = mowanItems(data);
        if (data.failed && data.failed.length) {
            console.log('Nguồn tìm lỗi: ' + data.failed.map(function (f) { return f && f.source; }).join(', '));
        }

        // Trang thiếu mục (< page_size) là trang cuối, như SPA.
        var next = items.length >= SEARCH_PAGE_SIZE ? (parseInt(page, 10) + 1).toString() : '';
        return Response.success(mowanBookItems(items), next);
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
