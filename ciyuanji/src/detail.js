load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = ciyuanjiBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        url = BASE_URL + '/b_d_' + bookId + '.html';
        var response = fetch(url, { headers: PC_HEADERS, timeout: FETCH_TIMEOUT });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var book = ciyuanjiNextData(response).props.book;
        if (!book || !book.bookName) throw new Error('Trang chi tiết không có dữ liệu truyện');

        var finished = String(book.endState) == '1';
        var genres = [];
        var seen = {};
        if (book.firstClassify && book.firstClassifyName) {
            genres.push({ title: book.firstClassifyName, input: book.firstClassify + '_0_0_0_1', script: 'gen.js' });
            seen[book.firstClassifyName] = true;
        }
        (book.tagList || []).forEach(function (t) {
            if (!t || !t.tagId || !t.tagName || seen[t.tagName]) return;
            seen[t.tagName] = true;
            genres.push({ title: t.tagName, input: 'tag_' + t.tagId, script: 'gen.js' });
        });

        var classify = [book.firstClassifyName, book.secondClassifyName].filter(function (x) { return x; }).join(' / ');

        return Response.success({
            name: book.bookName,
            cover: ciyuanjiCover(book.imgUrl),
            author: String(book.authorName || '').trim(),
            description: String(book.notes || '').trim().replace(/\r?\n/g, '<br>'),
            detail: [
                classify ? '分类: ' + classify : '',
                '字数: ' + ciyuanjiWords(book.wordCount),
                book.chapterCount ? '章节: ' + book.chapterCount : '',
                '状态: ' + (finished ? '完本' : '连载'),
                book.latestUpdateTime ? '更新: ' + book.latestUpdateTime : '',
                book.latestChapterName ? '最新: ' + book.latestChapterName : ''
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: !finished,
            url: url,
            host: BASE_URL,
            genres: genres
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
