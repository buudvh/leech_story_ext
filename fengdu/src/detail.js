load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = fengduBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');
        url = fengduBookUrl(bookId);

        var book = fengduBookInfo(bookId);
        var chapters = book.bookChapterAllInfo || [];
        var latest = chapters.length ? fengduChapterName(chapters[chapters.length - 1].chapterTitle) : '';
        var tags = (book.bookTags || []).map(function (x) { return cleanText(x && x.name); }).filter(function (x) { return x; });
        var category = [cleanText(book.bookBClassificationName), cleanText(book.c_class_name)].filter(function (x, i, arr) {
            return x && arr.indexOf(x) == i;
        }).join(' · ');

        var genres = [];
        var genreInput = fengduGenreInput(book.bookBClassification);
        if (genreInput && book.bookBClassificationName) {
            genres.push({ title: cleanText(book.bookBClassificationName), input: genreInput, script: 'gen.js' });
        }

        var description = String(book.bookDesc || '').trim().split(/\r?\n/).map(function (x) {
            return x.replace(/^[\s　]+|[\s　]+$/g, '');
        }).filter(function (x) { return x; }).join('<br>');

        return Response.success({
            name: cleanText(book.bookTitle),
            cover: fengduCover(book.bookCoverImage),
            author: cleanText(book.bookAuthor),
            description: description || cleanText(book.bookRecommendWords),
            detail: [
                category ? '分类: ' + category : '',
                [fengduStatus(book), fengduWords(book.book_words_num), (book.bookChapterNumber || chapters.length) + '章'].filter(function (x) {
                    return x;
                }).join(' · '),
                book.crazy_rating ? '评分: ' + book.crazy_rating : '',
                tags.length ? '标签: ' + tags.join(' ') : '',
                book.bookLatestUpdateTime ? '更新: ' + book.bookLatestUpdateTime : '',
                latest ? '最新: ' + latest : ''
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: String(book.bookIsFinished) != '1',
            url: url,
            host: BASE_URL,
            genres: genres
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
