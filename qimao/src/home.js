load('crypto.js');
load('config.js');

// Tab "全部" + các 作品分类 cấp 1 của kênh đang lọc (kênh khác phân loại ⇒ 0 truyện, nên không hiện).
function execute() {
    var channel = readFilters().channel;
    var tabs = [{ title: '全部', input: 'a|a', script: 'cat.js' }];
    loadCategories().forEach(function (c) {
        if (channel === 'a' || String(c.type) === channel) {
            tabs.push({ title: cleanText(c.name), input: c.id + '|a', script: 'cat.js' });
        }
    });
    return Response.success(tabs);
}
