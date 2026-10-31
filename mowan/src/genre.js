load('libs.js');
load('config.js');

// Chuyên mục của từng nguồn ở trang Khám phá: "<nguồn> · <nhóm> · <chuyên mục>".
function execute() {
    var url = API_URL + '/discover/tabs';
    try {
        var data = mowanApi('/discover/tabs', {}) || {};
        var list = [];
        (data.sources || []).forEach(function (s) {
            if (s && s.source) list = list.concat(mowanTabEntries(s.source, s.name || s.source, s.tabs));
        });
        if (!list.length) throw new Error('Trang chưa cấu hình chuyên mục nào');
        return Response.success(list);
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
