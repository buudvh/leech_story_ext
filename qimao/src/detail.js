load('crypto.js');
load('config.js');

function formatTime(seconds) {
    var time = parseInt(seconds, 10);
    if (!time) return '';
    var d = new Date(time * 1000);
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function fetchDetail(bookId) {
    try {
        return fetchApp(APP_BC, '/api/v5/book/detail', { id: bookId, imei_ip: IMEI_IP, teeny_mode: '0' });
    } catch (error) {
        return fetchApp(APP_BC, '/api/v4/book/detail', { id: bookId, imei_ip: IMEI_IP, teeny_mode: '0' });
    }
}

// Chip thể loại mở danh sách của trang 书库: tra id phân loại theo tên (API chi tiết không trả id).
function buildGenres(book) {
    var name1 = cleanText(book.category1_name);
    var name2 = cleanText(book.category2_name);
    if (!name1 && !name2) return [];
    var categories = loadCategories();
    var parent = null;
    var child = null;
    categories.forEach(function (c) {
        if (!parent && name1 && cleanText(c.name) === name1) parent = c;
    });
    // Phân loại cấp 2 tìm trong cấp 1 đã khớp; cấp 1 không khớp (tên app khác tên web) thì tìm trong mọi nhánh.
    (parent ? [parent] : categories).forEach(function (c) {
        (c.children || []).forEach(function (x) {
            if (!child && name2 && cleanText(x.name) === name2) {
                child = x;
                parent = parent || c;
            }
        });
    });
    var genres = [];
    if (parent) genres.push({ title: cleanText(parent.name), input: parent.id + '|a', script: 'cat.js' });
    if (parent && child) genres.push({ title: cleanText(child.name), input: parent.id + '|' + child.id, script: 'cat.js' });
    return genres;
}

// Đề xuất: các section sách của trang chi tiết (同类好书推荐, 作者其他作品...); bỏ section chủ đề/bài viết.
function buildSuggests(data, author) {
    var suggests = [];
    var hasAuthorBooks = false;
    (data.sections || []).forEach(function (section) {
        var title = cleanText((section.section_header || {}).section_title);
        if (!/推荐|作者|作品/.test(title) || /话题|书单|帖子/.test(title)) return;
        var books = (section.books || []).filter(function (b) { return b && b.id && b.title; }).map(function (b) {
            return { id: String(b.id), title: b.title, image_link: b.image_link, sub_title: b.sub_title || '' };
        });
        if (!books.length) return;
        if (/作者/.test(title)) hasAuthorBooks = true;
        suggests.push({ title: title, input: 'books|' + JSON.stringify(books), script: 'rank.js' });
    });
    if (!hasAuthorBooks && author) suggests.push({ title: '作者：' + author, input: author, script: 'search.js' });
    return suggests;
}

function execute(url) {
    var bookId = parseBookId(url);
    if (!bookId) return Response.error('Không đọc được id truyện từ link: ' + url);
    try {
        var data = fetchDetail(bookId);
        var book = data.book;
        if (!book || !book.title) throw new Error('Không thấy thông tin truyện');
        var author = cleanText(book.author || book.original_author);
        var attr = book.attribute || {};
        var tags = (book.book_tag_list || []).map(function (t) { return cleanText(t && t.title); }).filter(function (x) { return x; });
        var detail = [
            subTitleInfo(book.category_over_words) || joinInfo([book.category1_name, book.category2_name, book.is_over == 1 ? '完结' : '连载']),
            attr.score ? '评分: ' + attr.score + (attr.score_title ? ' (' + cleanText(attr.score_title) + ')' : '') : '',
            book.chapters ? '章节: ' + book.chapters + '章' : '',
            book.latest_chapter_title ? '最新: ' + cleanText(book.latest_chapter_title) : '',
            book.update_time ? '更新: ' + formatTime(book.update_time) : '',
            attr.rank_title ? '榜单: ' + cleanText(String(attr.rank_title).replace(/#/g, '')) : '',
            tags.length ? '标签: ' + tags.join(' · ') : '',
            book.characters ? '主角: ' + cleanText(book.characters) : '',
            book.alias_title ? '别名: ' + cleanText(book.alias_title) : ''
        ].filter(function (x) { return x; }).map(escapeHtml).join('<br>');
        var description = String(book.intro || '').split(/\r?\n/).map(cleanText).filter(function (x) { return x; }).map(escapeHtml).join('<br>');
        var commentSource = function (title, sort) {
            return { title: title, input: JSON.stringify({ bookId: bookId, sort: sort }), script: 'comment.js' };
        };
        var result = {
            name: cleanText(book.title),
            cover: coverOf(book.image_link || book.thumb_image_link),
            author: author || '佚名',
            description: description || '暂无简介',
            detail: detail,
            ongoing: book.is_over != 1,
            url: bookUrl(bookId),
            host: BASE_URL,
            genres: buildGenres(book),
            suggests: buildSuggests(data, author)
        };
        // Tắt bình luận ⇒ không khai nguồn nào (màn chi tiết không gọi comment.js).
        if (commentMode() !== 'off') {
            result.comment = commentSource('Bình luận nổi bật', '0');
            result.comments = [commentSource('Bình luận mới nhất', '1')];
        }
        return Response.success(result);
    } catch (error) {
        return Response.error('Qimao: ' + error.message + '\nUrl: ' + url);
    }
}
