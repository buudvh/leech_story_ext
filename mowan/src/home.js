load('libs.js');
load('config.js');

// Chuyên mục "平台精选" của trang Khám phá (cấu hình động, cần đăng nhập); không có thì lấy chuyên mục của nguồn đầu.
function execute() {
    var url = API_URL + '/discover/tabs';
    try {
        var data = mowanApi('/discover/tabs', {}) || {};
        var list = mowanTabEntries('platform', '', data.platform_tabs);
        if (!list.length && data.sources && data.sources.length) {
            var first = data.sources[0];
            list = mowanTabEntries(first.source, first.name, first.tabs);
        }
        if (!list.length) throw new Error('Trang chưa cấu hình chuyên mục nào');
        return Response.success(list);
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
