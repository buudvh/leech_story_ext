load('libs.js');
load('config.js');
load('gbk.js');

// Tìm trên trang piaotia (không qua STV): /modules/article/search.php theo tên truyện, từ khoá mã GBK (gbk.js).
// Kết quả là bảng truyện như trang thể loại (tên | chương mới | tác giả | …), phân trang ở #pagelink. Khớp đúng một
// truyện thì trang chuyển thẳng sang trang truyện ⇒ trả một mục lấy từ trang đó (mã truyện ở link "加入书架").
function execute(key, page) {
    page = page || '1';
    var url = BASE_URL + '/modules/article/search.php?searchtype=articlename&searchkey=' +
        GBK.encode(String(key || '').trim()) + '&page=' + page;
    try {
        var response = fetch(url);
        if (!response.ok) return Response.error('fetch ' + url + ' failed: status ' + response.status);
        var doc = response.html('gbk');

        var title = $.Q(doc, '#content h1').text().trim();
        var bid = ($.Q(doc, 'a[href*="addbookcase"]').attr('href') || '').match(/bid=(\d+)/);
        if (title && bid) {
            var id = bid[1];
            var folder = id.length <= 3 ? '0' : id.slice(0, id.length - 3);
            return Response.success([{
                name: title,
                link: BASE_URL + '/bookinfo/' + folder + '/' + id + '.html',
                cover: buildCover(id),
                description: '',
                host: BASE_URL
            }]);
        }

        var data = [];
        $.QA(doc, 'table.grid tr').forEach(function (e) {
            var book = $.Q(e, 'td a');
            var link = book.attr('href');
            if (!link || link.indexOf('/bookinfo/') < 0) return;
            data.push({
                name: book.text().trim(),
                link: link,
                cover: buildCover(getBookid(link)),
                description: '作者: ' + $.Q(e, 'td', 2).text().trim() + '\n最新: ' + $.Q(e, 'td', 1).text().trim(),
                host: BASE_URL
            });
        });

        var next = $.Q(doc, '#pagelink strong + a').text().trim();
        return Response.success(data, next);
    } catch (error) {
        return Response.error('Url: ' + url + '\nMessage: ' + error.message);
    }
}
