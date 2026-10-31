load('libs.js');
load('config.js');

function execute(url) {
    try {
        var ids = String(url).match(/\/r\/(\d+)\/(\d+)/);
        if (!ids) throw new Error('Không đọc được id chương');
        url = BASE_URL + '/r/' + ids[1] + '/' + ids[2] + '.html';

        var response = fetch(url);
        if (response.status == 404) return Response.error(GONE_MESSAGE + '\nUrl: ' + url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var text = response.text();
        var doc = Html.parse(text);
        // Cả chương nằm sẵn trong một trang, chia thành nhiều .section (1/5 … 5/5); "下一页" chỉ đổi section bằng JS.
        var sections = doc.select('.book .section');
        if (sections.size() == 0) throw new Error('Không thấy nội dung chương');
        var total = text.match(/var\s+total\s*=\s*(\d+)/);
        if (total && sections.size() < parseInt(total[1], 10)) {
            throw new Error('Thiếu phần chương: ' + sections.size() + '/' + total[1]);
        }

        var title = cleanText(sections.first().select('h2').first().text()).replace(/\s*[（(]\d+\/\d+[）)]$/, '');

        // Trang cắt chương theo số ký tự nên đoạn cuối phần trước và đoạn đầu phần sau thường là hai nửa của một đoạn.
        // Khi chỗ cắt rơi đúng ranh giới đoạn, trang chèn một <p></p> rỗng ở một bên ⇒ chỉ nối khi cả hai bên có chữ.
        var lines = [];
        var joinNext = false;
        sections.forEach(function (section) {
            var con = section.select('.con').first();
            var items = [];
            con.select('p').forEach(function (p) {
                items.push(cleanText(p.text()));
            });
            if (!items.length) {
                items = con.html().split(/<br\s*\/?>|\n/i).map(function (x) {
                    return cleanText(Html.parse(x).text());
                });
            }

            var split = false;
            if (items.length && PAGE_SPLIT_RE.test(items[items.length - 1])) {
                split = true;
                items.pop();
            }
            items.forEach(function (item, i) {
                if (i == 0 && joinNext && item && lines.length && lines[lines.length - 1]) {
                    lines[lines.length - 1] += item;
                } else {
                    lines.push(item);
                }
            });
            joinNext = split;
        });

        var paragraphs = cleanChapterLines(lines, title);
        if (!paragraphs.length) throw new Error('Không thấy nội dung chương');

        return Response.success(cleanHtml(paragraphs.map(escapeHtml).join('\n')));
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
