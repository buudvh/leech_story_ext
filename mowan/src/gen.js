load('libs.js');
load('config.js');

// input: "source=<nguồn|platform>&tab=<key>" (home.js/genre.js dựng).
function execute(input, page) {
    var url = API_URL + '/discover/content';
    try {
        var q = mowanQuery('?' + input);
        if (!q.source || !q.tab) throw new Error('Thiếu nguồn/chuyên mục');
        page = page || '1';

        var data = mowanApi('/discover/content', { source: q.source, tab: q.tab, page: page, page_size: DISCOVER_PAGE_SIZE }) || {};
        var items = mowanItems(data);

        // Chỉ trang rỗng mới là hết, như SPA.
        return Response.success(mowanBookItems(items), items.length > 0 ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
