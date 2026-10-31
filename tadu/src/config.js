var BASE_URL = 'https://m.tadu.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
// Bản web chưa đăng nhập chỉ mở 30 chương đầu; từ chương 31 trang trả nửa chương (_book_part_half).
var FREE_CHAPTER_LIMIT = 30;
var CHAPTERS_PER_PAGE = 100;
var LOCKED_MESSAGE = '本章需登录塔读后才能阅读（网页版未登录只开放前' + FREE_CHAPTER_LIMIT + '章），请前往塔读APP或登录后阅读。';

// Tên thể loại -> id (lấy từ m.tadu.com/category).
var CATEGORY_IDS = {
    '现代都市': '103', '历史架空': '108', '东方玄幻': '99', '军事战争': '113', '武侠仙侠': '109',
    '科幻末世': '111', '灵异悬疑': '128', '西方奇幻': '107', '游戏竞技': '112', '脑洞创意': '135',
    '短篇小说': '281', '古代言情': '129', '幻想言情': '133', '现代言情': '104', '浪漫青春': '105',
    '悬疑小说': '288'
};

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

function taduBookId(url) {
    var m = String(url).match(/\/book\/(?:catalog\/)?(\d+)/);
    return m ? m[1] : null;
}

function taduBookUrl(bookId) {
    return BASE_URL + '/book/' + bookId;
}

function taduCatalogUrl(bookId, pgNum) {
    return BASE_URL + '/book/catalog/' + bookId + '?pgNum=' + pgNum + '&soutFlag=0';
}

// Ảnh bìa nằm ở data-src; "https://media7.tadu.com//" là bìa rỗng.
function taduCover(src) {
    src = String(src || '').trim();
    if (!src || /^(https?:)?\/\/[^\/]+\/*$/.test(src) || src.indexOf('defaultBook') != -1) return DEFAULT_COVER;
    if (src.startsWith('//')) return 'https:' + src;
    return src;
}

function cleanText(text) {
    return String(text || '').replace(/[\s 　]+/g, ' ').trim();
}

// Danh sách truyện dạng HTML (trang phân loại, xếp hạng, tìm kiếm).
function parseBookList(doc) {
    var data = [];
    doc.select('a[href^="/book/"]').forEach(function (e) {
        var bookId = taduBookId(e.attr('href'));
        var name = cleanText(e.select('h2').first().text());
        if (!bookId || !name) return;
        var info = e.select('.info div').first().text() || e.select('.book_detail span').first().text();
        var intro = e.select('p').first().text();
        var rank = e.select('.ranking').first().text();
        data.push({
            name: name,
            link: taduBookUrl(bookId),
            cover: taduCover(e.select('img').first().attr('data-src')),
            description: (rank ? 'No.' + rank + ' · ' : '') + cleanText(info).replace(/\s*\|\s*/g, ' · ')
                + (intro ? '\n' + cleanText(intro) : ''),
            host: BASE_URL
        });
    });
    return data;
}

function isTrue(value) {
    return value === true || String(value) == 'true' || String(value) == '1';
}
