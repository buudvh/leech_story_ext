load('libs.js');
load('config.js');

function execute(url) {
    try {
        var ids = String(url).match(/\/book\/(\d+)\/(\d+)/);
        if (!ids) throw new Error('Không đọc được id chương');
        url = BASE_URL + '/book/' + ids[1] + '/' + ids[2];

        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        // Không có cờ ⇒ không phải trang chương (lỗi/trang chặn), báo lỗi thay vì coi là chương khoá.
        if (doc.select('#canReadFlag').size() == 0) throw new Error('Không thấy trang chương');
        var canRead = doc.select('#canReadFlag').first().attr('value');
        var partUrl = doc.select('#bookPartResourceUrl').first().attr('value');

        // Chương cần đăng nhập: canReadFlag != 1, hoặc trang chỉ cấp nửa chương (_book_part_half) kèm khung che.
        if (canRead != '1' || partUrl.indexOf('_book_part_half') != -1 || doc.select('.masktips').size() > 0) {
            return Response.success(LOCKED_MESSAGE);
        }
        if (!partUrl) throw new Error('Không thấy bookPartResourceUrl');
        if (partUrl.startsWith('/')) partUrl = BASE_URL + partUrl;

        var part = fetch(partUrl, { headers: { 'Referer': url } });
        if (!part.ok) throw new Error(`Status ${part.status}`);

        var htm = (part.json() || {}).content || '';
        if (!htm) throw new Error('Không thấy nội dung chương');

        return Response.success(cleanHtml(htm));
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
