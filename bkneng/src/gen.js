load('libs.js');
load('config.js');

function execute(input, page) {
    var url;
    try {
        // Mỗi khối chỉ có một trang, không có trang sau.
        if (page && page != '1') return Response.success([], '');

        var parts = String(input).split('|');
        var channel = parts[0] == 'girl' ? 'girl' : 'boy';
        var section = parts[1] || 'hot';
        var data = [];
        var seen = {};

        // Khối có ở bản wap thì lấy wap trước (có tác giả, giới thiệu), rồi bù sách chỉ có ở bản máy tính.
        if (section != 'hot' && section != 'update') {
            url = BASE_URL + WAP_PAGES[channel];
            try {
                bkParseWapSection(bkFetchHtml(WAP_PAGES[channel]), section, data, seen);
            } catch (error) {
            }
        }
        url = BASE_URL + PC_PAGES[channel];
        try {
            bkParsePcSection(bkFetchHtml(PC_PAGES[channel]), section, data, seen);
        } catch (error) {
            if (!data.length) throw error;
        }

        if (!data.length) throw new Error('Length = 0');

        return Response.success(data.map(bkToResult), '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
