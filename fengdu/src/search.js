load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = parseInt(page || '1', 10);
        var path = 'search_book?action=search_book&search_keyword=' + encodeURIComponent(key);
        url = fengduApiUrl(path);

        // API trả một lần (tối đa 100 truyện, xếp theo id, bỏ qua tham số trang) ⇒ xếp lại và chia trang tại chỗ.
        var books = fengduApi(path);
        if (!books || typeof books.length != 'number') books = [];
        books = rankBooks(books, String(key || '').trim());

        var start = (page - 1) * LIST_PAGE_SIZE;
        var data = books.slice(start, start + LIST_PAGE_SIZE).map(fengduBookItem);
        var hasNext = start + LIST_PAGE_SIZE < books.length;
        return Response.success(data, hasNext ? (page + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}

// Tên trùng khớp > tên bắt đầu bằng từ khoá > tên chứa từ khoá > tác giả trùng; cùng mức thì truyện hot trước.
function rankBooks(books, key) {
    return books.map(function (book, index) {
        var name = cleanText(book.bookTitle);
        var score = 4;
        if (name == key) score = 0;
        else if (name.indexOf(key) == 0) score = 1;
        else if (name.indexOf(key) != -1) score = 2;
        else if (cleanText(book.bookAuthor) == key) score = 3;
        return { book: book, index: index, score: score, hot: parseInt(book.crazy_popularity || '0', 10) };
    }).sort(function (a, b) {
        return a.score - b.score || b.hot - a.hot || a.index - b.index;
    }).map(function (x) {
        return x.book;
    });
}
