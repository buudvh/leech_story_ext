load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = yueyouBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        url = yueyouBookUrl(bookId);
        var response = fetch(url);
        if (response.status == 404) return Response.error(GONE_MESSAGE + '\nUrl: ' + url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var text = response.text();
        var doc = Html.parse(text);
        var name = cleanBookName(doc.select('.face-info-title').first().text());
        if (!name) throw new Error('Không thấy thông tin truyện');

        // .face-info .v-words: "作者：xxx", "分类：都市人生", "字数：154.73 万字"
        var fields = {};
        doc.select('.face-info .v-words span').forEach(function (e) {
            var m = cleanText(e.text()).match(/^([^：:]+)[：:]\s*(.*)$/);
            if (m) fields[m[1].trim()] = m[2].trim();
        });
        var category = fields['分类'] || '';
        var status = cleanText(doc.select('.face-info .content-label').first().text());
        var chapterCount = cleanText(doc.select('.sumchapter span').first().text()).replace(/查看目录.*$/, '').replace(/\s+/g, ' ').trim();
        var updateMatch = text.match(/var\s+update_time\s*=\s*"([^"]+)"/);

        var genres = [];
        if (category && CLASSIFY_IDS[category]) {
            genres.push({ title: category, input: CLASSIFY_IDS[category], script: 'gen.js' });
        }

        return Response.success({
            name: name,
            cover: yueyouCover(doc.select('.face-cover img').first().attr('src')),
            author: fields['作者'] || '',
            description: introduce(text),
            detail: [
                category ? '分类: ' + category : '',
                fields['字数'] ? '字数: ' + fields['字数'].replace(/\s+/g, '') : '',
                chapterCount,
                updateMatch ? '更新: ' + updateMatch[1] : ''
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: status.indexOf('完结') == -1,
            url: url,
            host: BASE_URL,
            genres: genres
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

// Đọc giới thiệu từ HTML gốc để giữ xuống dòng (text() gộp mất \n); bỏ nút "展开" p.detail-btn.
function introduce(text) {
    var m = String(text).match(/<div id="intro"[^>]*>([\s\S]*?)(?:<p class="detail-btn"|<\/div>)/);
    if (!m) return '';
    return m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .split(/\r?\n/).map(function (x) {
            return cleanText(x);
        }).filter(function (x) { return x; }).join('<br>');
}
