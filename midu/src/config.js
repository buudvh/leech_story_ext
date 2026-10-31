var BASE_URL = 'https://www.midureader.com';
var API_URL = 'https://api.midukanshu.com';
// Mục lục/chương nằm trên CDN; host thứ hai cùng dữ liệu, dùng khi host đầu rớt kết nối.
var BOOK_HOSTS = ['https://book.midukanshu.com', 'https://book.midureader.com'];
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
// API chỉ nhận POST dạng form; thiếu Content-Type thì báo "book_id不能为空".
var FORM_HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' };
var EMPTY_CHAPTER_MESSAGE = '本章无内容。';
var CN_NUM = '\\d０-９一二三四五六七八九十百千万零〇两';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

function miduBookId(url) {
    var m = String(url).match(/([0-9a-f]{32})/i);
    return m ? m[1].toLowerCase() : null;
}

function miduBookUrl(bookId) {
    return BASE_URL + '/book/' + bookId;
}

function miduChapterUrl(chapter) {
    return BOOK_HOSTS[0] + '/book/chapter/segment/master/' + chapter.bookId + '_' + chapter.chapterId
        + '.txt?md5=' + (chapter.content_md5 || '');
}

function miduCover(item) {
    var src = (item && item.coverImage && item.coverImage.thumbnail) || (item && item.cover) || '';
    src = String(src).trim();
    if (!src) return DEFAULT_COVER;
    if (src.startsWith('//')) return 'https:' + src;
    return src;
}

// page của API đánh từ 0 (trang 0 = trang đầu).
function miduApi(path, body) {
    var response = fetch(API_URL + path, { method: 'POST', headers: FORM_HEADERS, body: 'app=midu&' + body });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    var json = response.json();
    if (!json || json.code != 0) throw new Error((json && json.message) || 'API lỗi');
    return json.data;
}

function fetchBookFile(path, timeout) {
    var status = 0;
    for (var i = 0; i < BOOK_HOSTS.length; i++) {
        var response = fetch(BOOK_HOSTS[i] + path, { timeout: timeout || 15000 });
        if (response.ok) return response;
        status = response.status;
    }
    throw new Error(`Status ${status}`);
}

function cleanText(text) {
    return String(text || '').replace(/[\s\u3000\u00a0]+/g, ' ').trim();
}

function wordCount(count) {
    var n = parseInt(count, 10);
    if (!n) return '';
    return n >= 10000 ? (Math.round(n / 1000) / 10) + '万字' : n + '字';
}

function isTrue(value) {
    return value === true || String(value) == 'true' || String(value) == '1';
}

// ---------------- Dọn tên chương ----------------

// Chương quảng cáo của nền tảng: tên đúng "广告章", nội dung chỉ là câu "本章无内容，请阅读下一章"
// (chương thật tên "第五十七章 广告", "招聘广告" vẫn giữ).
function isAdChapter(title) {
    return /^广告章\d*$/.test(cleanText(title));
}

// Ghi chú trong ngoặc vuông chỉ gồm các mẩu: 第三更/加更/二合一/4K/六千字/万字/求月票/VIP... (ngăn bởi dấu câu).
// "【三更半夜】", "【求婚】", "【车票】" không khớp vì còn chữ khác.
var NAME_NOTE_TOKEN = '(第?[' + CN_NUM + ']+更(完毕|到)?|[' + CN_NUM + ']*(推荐票|月票|打赏)?[加补爆]更[' + CN_NUM + ']*'
    + '|[' + CN_NUM + ']*章?合[一二]|[\\d.]+\\s*[kK](字|小章|大章)?|[' + CN_NUM + ']+千?字|万字(大章)?|大章'
    + '|求(订阅|月票|推荐票?|收藏|票票?|打赏|追读|首订|支持|关注|评论|投资|保底月票)|月票|推荐票|打赏|订阅'
    + '|VIP|(本章)?免费|限免|new|热|hot)';
var NAME_NOTE_RE = new RegExp('^[\\s，,、！!。.~～+]*' + NAME_NOTE_TOKEN + '([\\s，,、！!。.~～+]*' + NAME_NOTE_TOKEN + ')*[\\s，,、！!。.~～+]*$', 'i');

// Ngoặc tròn chứa lời xin phiếu/cảm ơn/thêm chương ⇒ rác; ngoặc khác ((上), (一), (大结局)…) là một phần tên chương.
var JUNK_NAME_PAREN = /\s*[（(][^（）()]*(求|加更|[一二三四五六七八九十\d]+更|月票|推荐票|打赏|盟主|感谢|谢谢)[^（）()]*[）)]/g;
// formatName cắt từ dấu ngoặc tròn ⇒ tạm đổi ngoặc sang ký tự riêng để giữ phần ngoặc còn lại.
var PAREN_FULL = String.fromCharCode(0xE000);
var PAREN_HALF = String.fromCharCode(0xE001);

function cleanChapterName(name) {
    var raw = cleanText(name);
    var text = raw;
    // Nhãn VIP/免费/限免/new/热 trong ngoặc, hoặc đứng riêng ở đầu/cuối tên.
    text = text.replace(/[【\[（(〔]\s*(VIP|免费|限免|new|热|hot)\s*[】\]）)〕]/gi, ' ');
    text = text.replace(/^(VIP|免费|限免|new)\s+/i, '').replace(/\s+(VIP|免费|限免|new)$/i, '');
    // Ghi chú cập nhật/xin phiếu trong 【】/[] (formatName chỉ cắt ở ngoặc tròn): 【第一更！】, [求订阅]...
    text = text.replace(/[【\[]([^】\]]*)[】\]]/g, function (m, inner) {
        return NAME_NOTE_RE.test(inner) ? ' ' : m;
    });
    // Lỗi gõ "弟2843章" → "第2843章".
    text = text.replace(new RegExp('^弟(\\s*[' + CN_NUM + ']+\\s*章)'), '第$1');
    // "1.第1章 ..." / "12、第12章 ..." → bỏ số thứ tự thừa ("125.第一军校" giữ nguyên).
    text = text.replace(new RegExp('^\\d+\\s*[.、．:：]\\s*(?=第\\s*[' + CN_NUM + ']+\\s*[章节回])'), '');
    // Số chương lặp: "第1章 第1章 xxx", "第一章第一章xxx".
    text = text.replace(new RegExp('^(第\\s*[' + CN_NUM + ']+\\s*[章节回])\\s*\\1\\s*'), '$1 ');
    // "第1358章尾声" → "第1358章 尾声".
    text = text.replace(new RegExp('^(第\\s*[' + CN_NUM + ']+\\s*[章节回])(?=[^\\s：:，,、.．\\-—])'), '$1 ');
    text = cleanText(text.replace(JUNK_NAME_PAREN, ''));
    // formatName bỏ số đầu tên ở "第1章 1xxx" ⇒ "第2章 2008年" sẽ thành "008年"; gặp dạng đó thì không gọi.
    if (!/^第(\d+)章\s+\1\d/.test(text)) {
        text = formatName(text.replace(/（/g, PAREN_FULL).replace(/\(/g, PAREN_HALF))
            .split(PAREN_FULL).join('（').split(PAREN_HALF).join('(');
    }
    // formatName cắt ở "求月票"... có thể để lại dấu phẩy treo: "四更，求月票" → "四更，".
    text = cleanText(text).replace(/[\s，,、：:；;]+$/, '');
    return text || raw;
}

// ---------------- Dọn nội dung chương ----------------

// Câu đệm của nền tảng khi chương không có nội dung (chương 广告章, chương "新书发布"...).
var STUB_PATTERNS = [
    /该章正在拼命上传中/,
    /本章无内容[，,]?\s*请阅读下一章/
];

// Đoạn rác: so khớp cả đoạn (sau khi trim).
var JUNK_PARAGRAPH_PATTERNS = [
    /^[（(]?\s*(未完待续|本章完|本章结束)\s*[）)]?[。.!！]*$/,
    // Dòng chấm dài của chương đệm (dòng "......" ngắn trong truyện là dấu ngắt cảnh, giữ).
    /^[.。·…]{30,}$/,
    // Cả đoạn chỉ là lời xin phiếu trong ngoặc: "（求收藏，求推荐票）" ("【求生任务…】" của truyện hệ thống vẫn giữ).
    /^[（(【\[]\s*求(收藏|推荐|月票|订阅|票|追读|打赏|评论|投资|首订|支持|关注)[^）)】\]]*[）)】\]]$/,
    // Cả đoạn là lời giới thiệu truyện khác: "（推荐傲无常的新书，昏君，…请顺手收藏一下）".
    /^[（(]\s*(推荐|推一本|推本|推书)[^）)]*(新书|《)[^）)]*[）)]$/,
    // Watermark/tải app.
    /(midukanshu|midureader)\.com/i,
    /米读(小说)?\s*(APP|app|客户端)?\s*(下载|首发)/
];

function isJunkParagraph(text) {
    for (var i = 0; i < JUNK_PARAGRAPH_PATTERNS.length; i++) {
        if (JUNK_PARAGRAPH_PATTERNS[i].test(text)) return true;
    }
    for (var j = 0; j < STUB_PATTERNS.length; j++) {
        if (STUB_PATTERNS[j].test(text)) return true;
    }
    // Lời nhắn PS của tác giả xin phiếu/mời vào nhóm.
    if (/^p\.?\s*s\.?\s*[:：.,，]/i.test(text) && /求|书友群|QQ群|读者群|群号|月票|推荐票|订阅|打赏|追读|收藏/.test(text)) return true;
    // Quảng cáo nhóm đọc giả kèm số nhóm.
    if (/(书友群|QQ群|读者群|粉丝群|群号)\s*[:：]?\s*[【\[（(]?\s*\d{5,}/.test(text)) return true;
    return false;
}

// Dòng đầu là tiêu đề chương lặp lại: "第八百零八章 莫崖", "第1358章尾声".
function isHeadingParagraph(text) {
    if (text.length > 40 || /[。“”"]/.test(text)) return false;
    return new RegExp('^(第\\s*[' + CN_NUM + ']+\\s*[章节回]|[\\d０-９]+\\s*章)').test(text);
}

function decodeEntities(text) {
    return text
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#0?39;|&apos;/gi, "'")
        .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
        .replace(/&amp;/gi, '&');
}

// paragraphs: [{content, paragraph_id}] của API ⇒ mảng đoạn văn đã dọn.
function cleanChapterParagraphs(paragraphs) {
    var lines = [];
    (paragraphs || []).forEach(function (p) {
        var text = decodeEntities(String((p && p.content) || ''));
        text = text.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[a-z][^>]*>/gi, '');
        text = text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b\ufeff]/g, '');
        // Ghi chú cuối đoạn: "...（未完待续）", "(本章完)".
        text = text.replace(/[（(]\s*(未完待续|本章完)\s*[）)]/g, '');
        text.split(/\r?\n/).forEach(function (line) {
            line = line.replace(/^[\s\u3000\u00a0]+|[\s\u3000\u00a0]+$/g, '');
            if (!line || isJunkParagraph(line)) return;
            // Dấu < > trần sẽ bị hiểu là thẻ HTML.
            lines.push(line.replace(/</g, '＜').replace(/>/g, '＞'));
        });
    });
    if (lines.length && isHeadingParagraph(lines[0])) lines.shift();
    return lines;
}
