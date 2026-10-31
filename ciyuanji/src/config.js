var BASE_URL = 'https://www.ciyuanji.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
// Danh sách luôn trả 10 truyện/trang dù URL xin nhiều hơn; trang thẻ thì 20.
var LIST_PAGE_SIZE = 10;
var TAG_PAGE_SIZE = 20;
// Khoá DES của nội dung chương (chỉ 8 byte đầu của khoá trong bundle trang web có tác dụng).
var CHAPTER_KEY = 'ZUreQN0E';
var VIP_MESSAGE = '本章为VIP章节，需在次元姬登录并订阅后才能阅读。';
// UA iPhone bị chuyển hết về trang chủ m.ciyuanji.com (tham số mã hoá) nên mọi request dùng UA máy tính.
var PC_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
};
// Trang chi tiết/chương nhúng cả mục lục (truyện dài tới 1–2 MB), mặc định 15s của app dễ hết giờ trên mạng di động.
var FETCH_TIMEOUT = 60000;

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

function ciyuanjiBookId(url) {
    var m = String(url).match(/\/b_d_(\d+)/) || String(url).match(/\/book_detail\/(\d+)/)
        || String(url).match(/\/chapter\/(\d+)_\d+/);
    return m ? m[1] : null;
}

// Trang là Next.js: dữ liệu nằm trong <script id="__NEXT_DATA__">. Trả về { page, props }.
function ciyuanjiNextData(response) {
    var text = response.text();
    var m = text.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    var raw = String(m ? m[1] : Html.parse(text).select('#__NEXT_DATA__').html()).trim();
    if (!raw) throw new Error('Không thấy __NEXT_DATA__ (trang bị chặn hoặc đổi cấu trúc)');
    var json;
    try {
        json = JSON.parse(raw);
    } catch (error) {
        json = JSON.parse(raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
    }
    return {
        page: json.page || '',
        props: (json.props && json.props.pageProps) || {}
    };
}

function ciyuanjiCover(url) {
    url = String(url || '').trim();
    if (!url) return DEFAULT_COVER;
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('http://')) return 'https://' + url.substring(7);
    if (url.startsWith('http')) return url;
    return BASE_URL + '/' + url.replace(/^\/+/, '');
}

function ciyuanjiWords(count) {
    var n = parseInt(count, 10) || 0;
    return n >= 10000 ? (n / 10000).toFixed(1) + '万字' : n + '字';
}

function ciyuanjiBook(e) {
    var parts = [];
    if (e.authorName) parts.push('作者: ' + e.authorName);
    if (e.firstClassifyName) parts.push(e.firstClassifyName);
    if (e.wordCount) parts.push(ciyuanjiWords(e.wordCount));
    parts.push(String(e.endState) == '1' ? '完本' : '连载');
    return {
        name: e.bookName,
        link: BASE_URL + '/b_d_' + e.bookId + '.html',
        cover: ciyuanjiCover(e.imgUrl),
        description: parts.join(' | ') + (e.latestChapterName ? '\n最新: ' + e.latestChapterName : ''),
        host: BASE_URL
    };
}
