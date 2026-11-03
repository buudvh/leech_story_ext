load('config.js');

// Review đứng đầu (như bản cũ), rồi Tất cả + 19 thể loại (hướng nam trước, `GENRES`). Tab /tim-kiem đi qua bộ lọc
// của Cấu hình (gen.js).
function execute() {
    var tabs = [
        { title: 'Review', script: 'review.js', input: '/review' },
        { title: 'Tất cả', script: 'gen.js', input: BASE_URL + '/tim-kiem?qs=1&vo=1' }
    ];
    GENRES.forEach(function (g) {
        tabs.push({ title: g[0], script: 'gen.js', input: BASE_URL + '/tim-kiem?qs=1&vo=1&genre=' + g[1] });
    });
    return Response.success(tabs);
}
