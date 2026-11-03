load('crypto.js');
load('config.js');

// Thể loại = 二级分类 của trang 书库, chỉ lấy các phân loại thuộc kênh đang lọc.
function execute() {
    var channel = readFilters().channel;
    var genres = [];
    loadCategories().forEach(function (c) {
        if (channel !== 'a' && String(c.type) !== channel) return;
        (c.children || []).forEach(function (child) {
            if (!child || !child.id || !child.name) return;
            genres.push({ title: cleanText(c.name) + ' · ' + cleanText(child.name), input: c.id + '|' + child.id, script: 'cat.js' });
        });
    });
    if (!genres.length) return Response.error('Không tải được danh sách thể loại Qimao');
    return Response.success(genres);
}
