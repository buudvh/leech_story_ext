load('libs.js');
load('config.js');
load('crypto.js');

function execute(url) {
    try {
        var m = String(url).match(/\/chapter\/(\d+)_(\d+)/);
        if (!m) throw new Error('Không đọc được id chương');

        url = BASE_URL + '/chapter/' + m[1] + '_' + m[2] + '.html';
        var response = fetch(url, { headers: PC_HEADERS, timeout: FETCH_TIMEOUT });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        // Chương trả phí khi chưa đăng nhập bị chuyển hướng 307 sang /login.
        if (/\/login(\.html)?\/?([?#]|$)/.test(String(response.url || ''))) return Response.success(VIP_MESSAGE);
        var next = ciyuanjiNextData(response);
        if (next.page == '/login') return Response.success(VIP_MESSAGE);

        var chapter = next.props.chapterContent;
        if (!chapter) throw new Error('Trang chương không có nội dung');
        // Chưa mua thì content chỉ là bản xem trước ~200 chữ.
        if (String(chapter.isFee) == '1' && String(chapter.isBuy) != '1') return Response.success(VIP_MESSAGE);
        if (!chapter.content) throw new Error('Chương không có nội dung');
        if (typeof CryptoJS === 'undefined') throw new Error('Thiếu crypto.js');

        var text = CryptoJS.DES.decrypt(String(chapter.content).replace(/\n|\r/g, ''), CryptoJS.enc.Utf8.parse(CHAPTER_KEY), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        if (!text) throw new Error('Giải mã nội dung chương thất bại');

        var htm = text.split(/\r?\n/).map(function (line) {
            return escapeHtml(line.replace(/^[\s　]+|[\s　]+$/g, ''));
        }).filter(function (line) { return line; }).join('<br>');

        return Response.success(cleanHtml(htm));
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
