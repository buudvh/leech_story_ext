load('libs.js');
load('common.js');
load('filter.js');
load('filter_sort.js');

// input: "cat:<mã thể loại>" | "tag:<slug>" | "rank:<mã sort>" (bảng xếp hạng của explore: mọi thể loại, sắp xếp cố
// định theo bảng) | kiểu cũ "slug,&update". Sắp xếp (trừ "rank:")/số chương/loại/trạng thái lấy từ cấu hình.
function execute(tag, page) {
    var url = '';
    try {
        if (!page) page = '1';
        var input = String(tag || '');
        var category = '';
        var slug = '';
        var sortCode = null;
        if (input.indexOf('cat:') === 0) {
            category = input.substring(4).trim();
        } else if (input.indexOf('tag:') === 0) {
            slug = input.substring(4).trim();
        } else if (input.indexOf('rank:') === 0) {
            sortCode = input.substring(5).trim();
        } else {
            // Kiểu cũ: phần sau "&" là sắp xếp, nay lấy từ cấu hình.
            slug = input.split('&')[0].trim().replace(/,+$/, '');
        }

        var result = qidianFetchBooks(category, slug, page, sortCode);
        url = result.url;
        if (result.error) return Response.error(result.error);
        if (!result.items.length) return Response.success([], null);
        return Response.success(result.items, (parseInt(page, 10) + 1).toString());
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
