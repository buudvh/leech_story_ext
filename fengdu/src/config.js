var BASE_URL = 'https://www.fengduxiaoshuo.com';
// API doReader của app 疯读; hai tên miền cùng trả một dữ liệu, tên miền sau là dự phòng.
var API_HOSTS = ['https://fiction.fengduxiaoshuo.com', 'https://touchlife.cootekservice.com'];
var API_TOKEN = '869b9667-c66c-44d1-bba4-73e82cf2daee';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
var LIST_PAGE_SIZE = 20;
// enter_bookinfo_index trả kèm toàn bộ mục lục (~1MB với truyện 2000 chương).
var BOOK_INFO_TIMEOUT = 60000;
var EMPTY_CHAPTER_MESSAGE = '本章内容暂未上线，请稍后再试。';
var CN_NUM = '0-9０-９零〇一二三四五六七八九十百千万两';

// Id phân loại -> giới tính (0 nam, 1 nữ). API lọc theo cả hai nên detail phải tra lại giới tính.
var CATEGORY_GENDER = {
    '4': 0, '9': 0, '12': 0, '13': 0, '16': 0, '17': 0, '18': 0, '19': 0, '20': 0, '21': 0, '23': 0, '24': 0,
    '1': 1, '2': 1, '3': 1, '5': 1, '6': 1, '7': 1, '10': 1, '26': 1, '27': 1, '28': 1, '29': 1
};

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

// Nhận cả link gọn /book/<id> lẫn link API (?bookId=<id>).
function fengduBookId(url) {
    var m = String(url).match(/\/book\/(\d+)/) || String(url).match(/[?&]bookId=(\d+)/);
    return m ? m[1] : null;
}

function fengduBookUrl(bookId) {
    return BASE_URL + '/book/' + bookId;
}

function fengduApiUrl(path, host) {
    return (host || API_HOSTS[0]) + '/doReader/' + path + (path.indexOf('?') == -1 ? '?' : '&') + '_token=' + API_TOKEN;
}

// Gọi API, trả về json.result. Lỗi mạng/HTTP thì thử tên miền dự phòng; result_code khác 2000 là lỗi thật.
function fengduApi(path, timeout) {
    var lastError = '';
    for (var i = 0; i < API_HOSTS.length; i++) {
        var response = fetch(fengduApiUrl(path, API_HOSTS[i]), { timeout: timeout || 15000 });
        if (!response.ok) {
            lastError = `Status ${response.status}`;
            continue;
        }
        var json = response.json();
        if (!json || String(json.result_code) != '2000') {
            // 29002 = không có truyện/chương này (err_msg vẫn là "ok").
            var message = json && json.err_msg && !/^ok$/i.test(json.err_msg) ? ' (' + json.err_msg + ')' : '';
            throw new Error('API trả mã ' + (json && json.result_code) + message);
        }
        return json.result == null ? {} : json.result;
    }
    throw new Error(lastError);
}

function fengduBookInfo(bookId) {
    var result = fengduApi('enter_bookinfo_index?bookId=' + bookId, BOOK_INFO_TIMEOUT);
    var book = result.detailedBookInfo;
    if (!book || !book.bookId) throw new Error('Không thấy truyện');
    return book;
}

// Bìa dùng http và có tên tệp chữ Hán; CDN phục vụ được https và thu nhỏ qua imageView2.
function fengduCover(src, small) {
    src = String(src || '').trim();
    if (!src) return DEFAULT_COVER;
    if (src.startsWith('//')) src = 'https:' + src;
    src = src.replace(/^http:\/\//, 'https://').replace(/[^\x21-\x7e]+/g, function (s) {
        return encodeURIComponent(s);
    });
    if (small && /fengduxiaoshuo\.com\//.test(src) && src.indexOf('?') == -1) src += '?imageView2/2/w/300';
    return src;
}

function cleanText(text) {
    return String(text || '').replace(/[\s　 ]+/g, ' ').trim();
}

function fengduWords(count) {
    count = parseInt(count || '0', 10);
    if (!count) return '';
    return count >= 10000 ? (count / 10000).toFixed(1) + '万字' : count + '字';
}

function fengduStatus(book) {
    return String(book.bookIsFinished) == '1' ? '完结' : '连载';
}

// input của gen.js; null nếu không biết giới tính của phân loại.
function fengduGenreInput(classId, extra) {
    var gender = CATEGORY_GENDER[String(classId)];
    if (gender === undefined) return null;
    return 'gender=' + gender + '&classificationId=' + classId + '&bookIsFinished=-1&sortTitle=0' + (extra || '');
}

function fengduBookItem(book) {
    var info = [
        cleanText(book.bookAuthor),
        cleanText(book.bookBClassificationName),
        fengduStatus(book),
        book.bookChapterNumber ? book.bookChapterNumber + '章' : ''
    ].filter(function (x) { return x; }).join(' · ');
    var intro = cleanText(book.bookDesc);
    return {
        name: cleanText(book.bookTitle),
        link: fengduBookUrl(book.bookId),
        cover: fengduCover(book.bookCoverImage, true),
        description: info + (intro ? '\n' + intro : ''),
        host: BASE_URL
    };
}

// ---------------- Mục lục & chương ----------------

// Tệp chương trên CDN: <bookId>_<chapterId>_<md5>.txt. Vài chương trỏ về tệp chung default.txt
// ("精彩内容更新中...") hoặc tệp đã mất (404) ⇒ những chương đó đọc qua API get_content_by_chapterId.
var CDN_CHAPTER_RE = /\/(\d+)_(\d+)_[0-9a-f]+\.txt$/;

function fengduContentApiUrl(bookId, chapterId) {
    return fengduApiUrl('get_content_by_chapterId?bookId=' + bookId + '&chapterId=' + chapterId);
}

function fengduChapterUrl(chapter) {
    var url = String(chapter.content_url || '').trim();
    var m = url.match(CDN_CHAPTER_RE);
    if (m && m[1] == String(chapter.bookId) && m[2] == String(chapter.chapterId)) return url;
    return fengduContentApiUrl(chapter.bookId, chapter.chapterId);
}

function fengduChapterIds(url) {
    url = String(url);
    var m = url.match(CDN_CHAPTER_RE);
    if (m) return { bookId: m[1], chapterId: m[2] };
    var b = url.match(/[?&]bookId=(\d+)/), c = url.match(/[?&]chapterId=(\d+)/);
    return b && c ? { bookId: b[1], chapterId: c[1] } : null;
}

// Ngoặc chứa lời xin phiếu/cảm ơn/thêm chương ⇒ rác; ngoặc khác ((一), (上), (大结局)…) là một phần tên chương.
var JUNK_TITLE_PAREN = /\s*[（(][^（）()]*(求|加更|[一二三四五六七八九十\d]+更|月票|推荐票|打赏|盟主|感谢|谢谢)[^（）()]*[）)]/g;

function fengduChapterName(name) {
    var result = cleanText(name);
    // Nhãn VIP/免费/限免/new/热 ở đầu hoặc cuối tên.
    result = result.replace(/^[【\[(（]?(VIP|vip|免费|限免)[】\])）]?\s*/, '')
        .replace(/\s*[【\[(（](VIP|vip|免费|限免|new|NEW|热|新)[】\])）]$/, '')
        .replace(/\s+(VIP|vip|免费|限免|new|NEW)$/, '');
    result = result.replace(JUNK_TITLE_PAREN, '');
    // "第1685 章" -> "第1685章"; "第1章 第1章 X" -> "第1章 X"; "第1章X" -> "第1章 X".
    result = result.replace(new RegExp('^第\\s*([' + CN_NUM + ']+)\\s*章'), '第$1章')
        .replace(new RegExp('^(第[' + CN_NUM + ']+章)\\s*\\1\\s*'), '$1 ')
        .replace(new RegExp('^(第[' + CN_NUM + ']+章)(?=[^\\s])'), '$1 ');
    // formatName cắt mọi thứ từ dấu ngoặc cuối ⇒ tạm thay ngoặc để giữ "(一)", "(大结局)".
    result = formatName(result.replace(/（/g, '').replace(/\(/g, ''))
        .replace(//g, '（').replace(//g, '(');
    // formatName bỏ số lặp "第1章 1，X" thành "第1章 ，X" ⇒ bỏ dấu câu thừa.
    result = result.replace(new RegExp('^(第[' + CN_NUM + ']+章)\\s*[，,、.．:：]\\s*'), '$1 ');
    return cleanText(result);
}

// Dòng rác: so khớp cả dòng (đã trim). Chỉ gồm mẫu chắc chắn không phải nội dung truyện.
var JUNK_LINES = [
    /^[（(【\[]?\s*本章完\s*[）)】\]]?$/,
    /^[（(【\[]?\s*未完待续\s*[）)】\]]?[。.…]*$/,
    /^(精彩内容更新中|内容更新中|章节内容加载中|正在加载)[。.…]*$/,
    /^(上一章|下一章|上一页|下一页|返回目录|目录|返回书页|加入书签|章节报错)([\s|｜\/·]*(上一章|下一章|上一页|下一页|返回目录|目录|返回书页|加入书签|章节报错))*$/,
    /^(https?:\/\/|www\.)\S+$/i
];
// Chỉ coi là rác khi dòng ngắn (≤ 40 ký tự) VÀ có mốc quảng bá rõ ràng; câu truyện kiểu
// "她把书放入书架。", "他打开手机app看了一眼。", "她关注了那个公众号。" phải được giữ.
var JUNK_SHORT_LINES = [
    // Cả dòng chỉ gồm lời xin: "求收藏！求推荐票！", "请记得加入书架"
    /^([请记得欢迎大家多多]*(求收藏|求推荐票?|求月票|求打赏|求订阅|求追读|加入书架|放入书架|收藏本站|投推荐票|投月票)[!！。~～、，,\s]*)+$/,
    // Mời theo dõi tài khoản: mở đầu bằng lời mời và có đuôi quảng cáo.
    /^(请|欢迎|记得)?(关注|搜索)(微信)?(公众号|微信号).{0,15}(看更多|更多好书|免费|领取|福利|追更|最新章节)/,
    // Watermark/mời tải app mang tên trang.
    /疯读小说|疯读APP|fengduxiaoshuo/i
];

function isJunkLine(line) {
    for (var i = 0; i < JUNK_LINES.length; i++) {
        if (JUNK_LINES[i].test(line)) return true;
    }
    if (line.length > 40) return false;
    for (var j = 0; j < JUNK_SHORT_LINES.length; j++) {
        if (JUNK_SHORT_LINES[j].test(line)) return true;
    }
    return false;
}

function decodeEntities(text) {
    return text.replace(/&nbsp;/gi, ' ').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
        .replace(/&#x([0-9a-f]+);/gi, function (m, n) { return String.fromCharCode(parseInt(n, 16)); })
        .replace(/&amp;/gi, '&');
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeTitle(text) {
    return String(text || '').replace(/[\s　 （）()【】\[\]！!？?，,。.：:、…·—-]+/g, '');
}

// Văn bản thuần của chương -> HTML các dòng nối <br>. title (nếu có) để bỏ tên chương lặp ở đầu.
function fengduContentHtml(text, title) {
    text = decodeEntities(String(text || '').replace(/﻿/g, '').replace(/\r\n?/g, '\n'))
        .replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<p[^>]*>/gi, '');
    var lines = text.split('\n').map(function (line) {
        return line.replace(/^[\s　 ]+|[\s　 ]+$/g, '');
    }).filter(function (line) {
        return line && !isJunkLine(line);
    });

    if (lines.length) {
        var first = normalizeTitle(lines[0]);
        var name = normalizeTitle(title);
        var isTitle = name && first && (first == name || (first.length >= 4 && name.indexOf(first) == 0));
        // Không có tên chương (đọc từ CDN): chỉ bỏ dòng ngắn mở đầu bằng "第…章", không bỏ "第一回合…".
        if (!isTitle) isTitle = lines[0].length <= 40 && new RegExp('^第[' + CN_NUM + ']+章').test(lines[0]);
        if (isTitle) lines.shift();
    }

    return lines.map(escapeHtml).join('<br>');
}

// Có nội dung thật (không rỗng, không phải câu giữ chỗ của CDN).
function fengduHasContent(text) {
    var plain = String(text || '').replace(/[\s　 ﻿.。…]+/g, '');
    return plain.length > 0 && !/^(精彩内容更新中|内容更新中)$/.test(plain) && !/^<\?xml/.test(plain);
}
