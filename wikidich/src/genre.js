load('config.js');

// Thể loại = các nhãn của form tìm kiếm, tên "Nhóm - Nhãn" (vd "Bàn tay vàng - Vô hệ thống"); mở ra là danh sách
// /tim-kiem theo nhãn + bộ lọc. Form cần đăng nhập ⇒ khách nhận các tab nhãn ở trang chủ như bản cũ.
function execute() {
    var tags = tagsFromSearchForm();
    if (tags.length) return Response.success(tags);

    var response = fetch(BASE_URL);
    if (!response.ok) return Response.error('HTTP ' + response.status + ' ' + BASE_URL);
    var doc = response.html();
    var data = [];
    doc.select('div.tag-tabs .tag-tab a').forEach(function (e) {
        data.push({
            title: e.text(),
            input: BASE_URL + e.attr('href'),
            script: 'gen.js'
        });
    });
    return Response.success(data);
}

// Khối `.tag-group` có ô `tag` (khối thứ hai là `ntag` = loại trừ): tiêu đề nhóm `.book-attr-group-name` đứng trước
// các nhãn `.book-attr-name` của nó, theo thứ tự trong trang.
function tagsFromSearchForm() {
    var response = fetch(BASE_URL + '/tim-kiem');
    if (!response.ok) return [];
    var groups = response.html().select('.tag-group');
    var box = null;
    for (var i = 0; i < groups.size(); i++) {
        if (groups.get(i).select('input[name=tag]').size() > 0) {
            box = groups.get(i);
            break;
        }
    }
    if (!box) return [];

    var data = [];
    var group = '';
    box.select('.book-attr-group-name, .book-attr-name').forEach(function (e) {
        if ((e.attr('class') || '').indexOf('book-attr-group-name') >= 0) {
            group = e.text().trim();
            return;
        }
        var id = e.select('input[name=tag]').attr('value');
        var name = e.select('label').text().trim();
        if (!id || !name) return;
        data.push({
            title: group ? group + ' - ' + name : name,
            input: BASE_URL + '/tim-kiem?qs=1&tag=' + id,
            script: 'gen.js'
        });
    });
    return data;
}
