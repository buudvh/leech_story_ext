var BASE_URL = 'https://sma.yueyouxs.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
// API phân loại luôn trả 5 truyện/trang (không nhận tham số cỡ trang) ⇒ gộp nhiều trang cho một lượt tải.
var CLASSIFY_PAGE_SIZE = 5;
var CLASSIFY_PAGES_PER_LOAD = 4;
var SEARCH_PAGE_SIZE = 20;
var GONE_MESSAGE = 'Truyện/chương đã bị gỡ khỏi trang web 阅友 (404)';
// Bản quyền này luôn 404 trên bản web (đo 2026-10-31), kể cả truyện isFee = 0.
var BLOCKED_COPYRIGHTS = ['红薯'];
// state 32 = truyện đã gỡ (trang chi tiết 404).
var REMOVED_STATE = 32;

// Tên thể loại -> classify_id (lấy từ /l/f/11.html, /l/f/21.html, /l/f/41.html; chỉ giữ mục có truyện).
var CLASSIFY_IDS = {
    '都市人生': '1100', '玄幻奇幻': '1101', '武侠仙侠': '1102', '仙侠武侠': '1102', '军事历史': '1103',
    '科幻末世': '1104', '游戏体育': '1105', '悬疑灵异': '1107', '脑洞大开': '1108',
    '现代言情': '2100', '古代言情': '2101', '幻想言情': '2102', '穿越时空': '2104', '宫闱争斗': '2105',
    '豪门总裁': '2106', '婚恋爱情': '2107', '经商种田': '2108',
    '出版读物': '3101', '文学小说': '3102', '古代典籍': '3103',
    '现实情感': '4100', '世俗百态': '4101', '家庭婚姻': '4102', '热血青春': '4103', '治愈成长': '4104',
    '奇闻怪谈': '4105', '悬疑脑洞': '4106', '古风言情': '4107'
};

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

function yueyouBookId(url) {
    var m = String(url).match(/\/[bcr]\/(\d+)/);
    return m ? m[1] : null;
}

function yueyouBookUrl(bookId) {
    return BASE_URL + '/b/' + bookId + '.html';
}

function yueyouCover(src) {
    src = String(src || '').trim();
    if (!src) return DEFAULT_COVER;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('/')) return BASE_URL + src;
    return src.replace(/^http:\/\//, 'https://');
}

function cleanText(text) {
    return String(text || '').replace(/[\s　 ]+/g, ' ').trim();
}

// Tên truyện đôi khi kèm đuôi quảng cáo: "（全文免费阅读）", "最新章节"...
function cleanBookName(name) {
    var result = cleanText(name)
        .replace(/\s*[（(][^（）()]*(?:免费|全文|阅读|全集|完本|最新章节)[^（）()]*[）)]\s*$/, '')
        .replace(/\s*(?:全文免费阅读|免费阅读|最新章节)\s*$/, '');
    return result || cleanText(name);
}

function wordsText(words) {
    var n = parseInt(words, 10);
    if (!n) return '';
    return n >= 10000 ? (n / 10000).toFixed(1) + '万字' : n + '字';
}

// Bản web 404 với truyện thu phí, bản quyền 红薯网 và truyện đã gỡ ⇒ không đưa vào danh sách.
function isReadableBook(book) {
    if (!book || !book.wapBookId) return false;
    if (String(book.isFee || 0) != '0') return false;
    if (parseInt(book.state, 10) == REMOVED_STATE) return false;
    var copyright = String(book.copyrightName || '');
    for (var i = 0; i < BLOCKED_COPYRIGHTS.length; i++) {
        if (copyright.indexOf(BLOCKED_COPYRIGHTS[i]) != -1) return false;
    }
    return true;
}

// Danh sách truyện dạng JSON (API tìm kiếm / phân loại); seen dùng để bỏ trùng giữa các trang.
function parseBookJson(list, seen) {
    var data = [];
    (list || []).forEach(function (book) {
        if (!isReadableBook(book)) return;
        var bookId = String(book.wapBookId);
        if (seen) {
            if (seen[bookId]) return;
            seen[bookId] = true;
        }
        var info = [
            book.authorName ? '作者: ' + cleanText(book.authorName) : '',
            cleanText(book.classifySecondName),
            book.fullFlag == 1 ? '完结' : '连载',
            wordsText(book.words)
        ].filter(function (x) { return x; }).join(' · ');
        var intro = cleanText(book.intro);
        data.push({
            name: cleanBookName(book.bookName),
            link: yueyouBookUrl(bookId),
            cover: yueyouCover(book.bookPic),
            description: info + (intro ? '\n' + (intro.length > 80 ? intro.substring(0, 80) + '…' : intro) : ''),
            host: BASE_URL
        });
    });
    return data;
}

// Danh sách truyện dạng HTML (trang 精选/推荐): mỗi mục là div có onclick="gotoPage('/b/<id>.html')".
function parseBookHtml(doc) {
    var data = [];
    var seen = {};
    doc.select('.v-list-item, .h-book-item').forEach(function (e) {
        var m = e.attr('onclick').match(/\/b\/(\d+)\.html/);
        if (!m || seen[m[1]]) return;
        var name = cleanBookName(e.select('.v-title, .h-book-title').first().text());
        if (!name) return;
        seen[m[1]] = true;
        var author = cleanText(e.select('.v-author').first().text());
        var info = [
            author ? '作者: ' + author : '',
            cleanText(e.select('.base-label').first().text()),
            cleanText(e.select('.v-words').first().text()).replace(/\s+/g, '')
        ].filter(function (x) { return x; }).join(' · ');
        var intro = cleanText(e.select('.v-intro').first().text());
        data.push({
            name: name,
            link: yueyouBookUrl(m[1]),
            cover: yueyouCover(e.select('img').first().attr('src')),
            description: info + (intro ? '\n' + (intro.length > 80 ? intro.substring(0, 80) + '…' : intro) : ''),
            host: BASE_URL
        });
    });
    return data;
}

// ---- Dọn tên chương (toc) ----

// Nhãn chèn vào tên chương: [VIP], 【免费】, "免费 第1章", "第1章 xxx new"... (chữ thường trong tên như "热菜" không bị đụng).
var CHAPTER_LABEL = '(?:VIP|vip|免费|限免|new|NEW|热|荐)';
var CHAPTER_LABEL_BRACKET_RE = new RegExp('\\s*[【\\[（(]\\s*' + CHAPTER_LABEL + '\\s*[】\\]）)]\\s*', 'g');
var CHAPTER_LABEL_EDGE_RE = new RegExp('^' + CHAPTER_LABEL + '\\s+|\\s+' + CHAPTER_LABEL + '$', 'g');
// Đuôi phần (上)/(中)/(下)/(一)/(2)/(大结局) là nội dung thật; formatName() cắt mọi ngoặc nên giữ lại rồi nối lại.
var CHAPTER_PART_RE = /\s*([（(]\s*(?:[上中下]|[一二三四五六七八九十]+|\d{1,2}|大结局|终章)\s*[）)])$/;

function cleanChapterName(name) {
    var result = cleanText(name)
        .replace(CHAPTER_LABEL_BRACKET_RE, ' ')
        .replace(CHAPTER_LABEL_EDGE_RE, '');
    result = cleanText(result)
        // "第1章 第1章 xxx" / "第1章第1章 xxx"
        .replace(/^(第[0-9零〇一二三四五六七八九十百千万]+[章节回])\s*\1\s*/, '$1 ')
        // "1、第1章 xxx" (dạng "1.第1章" đã có trong formatName)
        .replace(/^\d+\s*[、.．]\s*(第[0-9零〇一二三四五六七八九十百千万]+[章节回])\s*/, '$1 ');
    var part = '';
    var m = result.match(CHAPTER_PART_RE);
    if (m) {
        part = m[1];
        result = result.substring(0, result.length - m[0].length);
    }
    result = formatName(cleanText(result));
    return cleanText(result + part) || cleanText(name);
}

// ---- Dọn nội dung chương (chap) ----

// Dấu nối giữa các phần của một chương (trang cắt chương thành nhiều .section theo số ký tự).
var PAGE_SPLIT_RE = /^[（(]?\s*本章未完\s*[，,]?\s*请(?:翻页|点击下一页)[^）)]*[）)]?$/;

// Mỗi mẫu khớp CẢ đoạn (đã trim) ⇒ chỉ bỏ đoạn rác hoàn toàn, không cắt câu truyện có chữ trùng.
var JUNK_PARAGRAPH_PATTERNS = [
    PAGE_SPLIT_RE,
    /^[（(]?\s*本章完(?:结)?\s*[）)]?$/,                                   // (本章完)
    /^[（(]?\s*未完待续\s*[。.…]*\s*[）)]?$/,                               // (未完待续)
    /^.{0,40}(?:书友群|读者群).{0,40}$/,                                   // mời vào nhóm (nguồn Legado cũng bỏ dòng 书友群)
    /^.{0,30}(?:QQ|qq|粉丝|VX|vx|微信)群.{0,10}\d{5,}.{0,20}$/,              // "QQ群：123456"
    /^(?:上一章|下一章|上一页|下一页|返回目录|目录|返回书页|加入书架|章节报错|书签)(?:\s*[|｜/、]?\s*(?:上一章|下一章|上一页|下一页|返回目录|目录|返回书页|加入书架|章节报错|书签))*$/,
    // mời tải app: đoạn ngắn có đủ "tải/cài" + "APP/客户端" + chữ quảng cáo
    /^(?=.{0,50}$)(?=.*(?:下载|安装))(?=.*(?:APP|App|app|客户端))(?=.*(?:免费|阅读|看书|全本|畅读|永久|福利)).*$/,
    /^页面篇幅有限.{0,60}$/,
    /^万本小说\s*永久免费读$/,
    /^.{0,20}(?:阅友小说|阅友网|神马小说|yueyouxs|suixkan).{0,30}$/i,    // watermark tên trang
    /^(?:https?:\/\/|www\.)[\w.\-\/?=&%#]+$/i,                              // dòng chỉ có URL
    /^[（(【]?\s*(?:求|跪求)(?:收藏|推荐票?|月票|订阅|打赏|追读)[^。]{0,20}[）)】]?$/
];

function isJunkParagraph(text) {
    for (var i = 0; i < JUNK_PARAGRAPH_PATTERNS.length; i++) {
        if (JUNK_PARAGRAPH_PATTERNS[i].test(text)) return true;
    }
    return false;
}

function sameTitle(a, b) {
    var strip = function (x) {
        return String(x || '').replace(/[\s　 ：:，,。.！!？?、·\-—]+/g, '');
    };
    return !!strip(a) && strip(a) == strip(b);
}

// lines: đoạn đã gộp; title: tên chương (bỏ "(1/5)"). Trả mảng đoạn sạch.
function cleanChapterLines(lines, title) {
    var result = [];
    lines.forEach(function (line) {
        var text = cleanText(String(line).replace(/&(?:nbsp|ensp|emsp|#160|#12288);/g, ' '))   // thực thể sót lại (mã hoá hai lần)
            .replace(/\s*[（(]\s*本章完(?:结)?\s*[）)]\s*$/, '');   // "(本章完)" dính cuối đoạn
        if (!text || isJunkParagraph(text)) return;
        // Tiêu đề chương lặp lại ở đầu nội dung.
        if (!result.length && (sameTitle(text, title) || (/^第\S{1,12}[章节回]/.test(text) && text.length <= 40 && sameTitle(text.replace(/\s*[（(]\d+\/\d+[）)]$/, ''), title)))) return;
        result.push(text);
    });
    return result;
}

function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
