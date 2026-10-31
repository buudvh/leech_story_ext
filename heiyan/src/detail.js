load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = heiyanBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        // Trang chi tiết bản mobile có sẵn HTML; UA mặc định của app là iPhone nên tự sang w.heiyan.com.
        var response = fetch(MOBILE_URL + '/book/' + bookId);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var name = meta(doc, 'og:title') || doc.select('.detail .right span.cut').first().text();
        var author = meta(doc, 'og:novel:author') || doc.select('.detail .info a.name').first().text();
        var status = meta(doc, 'og:novel:status');
        var category = meta(doc, 'og:novel:category');
        var sortHref = doc.select('.detail .info a.sort').first().attr('href');
        var sortMatch = sortHref.match(/sort=(\d+)/);
        var info = doc.select('.detail .info div');

        var description = meta(doc, 'og:description') || doc.select('.book-intro .summary').first().text();
        var fullIntro = findIntroduce(name, bookId);
        if (fullIntro && fullIntro.length >= description.replace(/\.\.\.$/, '').length) {
            description = fullIntro;
        }

        var genres = [];
        if (category && sortMatch) {
            genres.push({ title: category, input: sortMatch[1] + '_-1_-1_-1_1', script: 'gen.js' });
        }

        return Response.success({
            name: name,
            cover: meta(doc, 'og:image') || doc.select('.detail .left img').first().attr('src') || DEFAULT_COVER,
            author: author.trim(),
            description: description.replace(/\r?\n/g, '<br>'),
            detail: [
                info.size() > 2 ? info.get(2).text() : '',
                '更新: ' + (meta(doc, 'og:novel:update_time') || ''),
                '最新: ' + (meta(doc, 'og:novel:latest_chapter_name') || '')
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: status.indexOf('完结') == -1,
            url: BASE_URL + '/book/' + bookId,
            host: BASE_URL,
            genres: genres
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function meta(doc, property) {
    return doc.select('meta[property="' + property + '"]').attr('content').trim();
}

// Trang chi tiết chỉ có giới thiệu bị cắt; API tìm kiếm trả bản đầy đủ.
function findIntroduce(name, bookId) {
    try {
        if (!name) return '';
        var response = fetch(SEARCH_API + '?queryString=' + encodeURIComponent(name) + '&highlight=false&page=1');
        if (!response.ok) return '';
        var content = response.json().data.content || [];
        for (var i = 0; i < content.length; i++) {
            if (String(content[i].id) == String(bookId)) return String(content[i].introduce || '').trim();
        }
    } catch (error) {
    }
    return '';
}
