load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = taduBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Mục lục chia trang 100 chương; số trang = số option của #chapter.
        url = taduCatalogUrl(bookId, 1);
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var count = doc.select('#chapter option').size() || 1;

        var data = [];
        for (var i = 1; i <= count; i++) {
            data.push(taduCatalogUrl(bookId, i));
        }

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
