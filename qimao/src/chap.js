load('crypto.js');
load('pako_inflate.js');
load('config.js');

// Nội dung chương (API app): base64 = 16 byte IV + AES-128-CBC. Truyện thường giải ra văn bản; sách xuất bản
// (reader_type 3) giải ra một EPUB nhỏ (ZIP) chứa trang xhtml của chương.
var IMAGE_PAGE_MESSAGE = 'Sách này là bản scan dạng ảnh (mỗi chương là một trang ảnh), tiện ích chỉ đọc được sách dạng chữ.';

function fetchContent(bookId, chapterId, agent) {
    var params = { chapterId: chapterId, id: bookId };
    if (agent) params.reader_agent = '1';
    return fetchApp(APP_KS, '/api/v1/chapter/content', params).content || '';
}

function decryptChapter(content) {
    var raw = CryptoJS.enc.Base64.parse(content);
    var iv = CryptoJS.lib.WordArray.create(raw.words.slice(0, 4), 16);
    var cipher = CryptoJS.lib.WordArray.create(raw.words.slice(4), raw.sigBytes - 16);
    return CryptoJS.AES.decrypt(CryptoJS.lib.CipherParams.create({ ciphertext: cipher }), CryptoJS.enc.Utf8.parse(CHAPTER_KEY), {
        iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
    });
}

function toBytes(wordArray) {
    var out = new Uint8Array(wordArray.sigBytes);
    for (var i = 0; i < out.length; i++) out[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    return out;
}

function utf8Decode(bytes) {
    var out = '';
    for (var i = 0; i < bytes.length;) {
        var c = bytes[i++];
        var code;
        if (c < 0x80) code = c;
        else if (c < 0xe0) code = ((c & 0x1f) << 6) | (bytes[i++] & 0x3f);
        else if (c < 0xf0) code = ((c & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
        else code = ((c & 0x07) << 18) | ((bytes[i++] & 0x3f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
        if (code > 0xffff) {
            code -= 0x10000;
            out += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
        } else {
            out += String.fromCharCode(code);
        }
    }
    return out;
}

function u16(b, o) { return b[o] | (b[o + 1] << 8); }
function u32(b, o) { return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0; }

// Các trang xhtml của EPUB theo thứ tự mục lục ZIP (bỏ nav/toc/cover).
function epubPages(bytes) {
    var eocd = -1;
    for (var i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
        if (u32(bytes, i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('EPUB hỏng: không thấy mục lục ZIP');
    var count = u16(bytes, eocd + 10);
    var offset = u32(bytes, eocd + 16);
    var pages = [];
    for (var n = 0; n < count; n++) {
        if (u32(bytes, offset) !== 0x02014b50) throw new Error('EPUB hỏng: mục lục ZIP sai');
        var method = u16(bytes, offset + 10);
        var size = u32(bytes, offset + 20);
        var nameLength = u16(bytes, offset + 28);
        var local = u32(bytes, offset + 42);
        var name = utf8Decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
        offset += 46 + nameLength + u16(bytes, offset + 30) + u16(bytes, offset + 32);
        if (!/\.x?html?$/i.test(name) || /(^|\/)(nav|toc|cover)[^\/]*$/i.test(name)) continue;
        var start = local + 30 + u16(bytes, local + 26) + u16(bytes, local + 28);
        var packed = bytes.subarray(start, start + size);
        if (method === 8) pages.push(utf8Decode(pako.inflateRaw(packed)));
        else if (method === 0) pages.push(utf8Decode(packed));
        else throw new Error('EPUB nén kiểu lạ: ' + method);
    }
    return pages;
}

function decodeEntities(text) {
    return text.replace(/&#x([0-9a-f]+);/gi, function (m, hex) { return String.fromCharCode(parseInt(hex, 16)); })
        .replace(/&#(\d+);/g, function (m, dec) { return String.fromCharCode(parseInt(dec, 10)); })
        .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

// Trang xhtml -> đoạn văn. Bỏ tiêu đề chương (thẻ h* đứng đầu trang hoặc có class "...title"; app đã hiện tên chương).
function htmlLines(html) {
    var body = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
    var text = (body ? body[1] : html)
        .replace(/<(script|style|head)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/^\s*(<h([1-6])\b[^>]*>[\s\S]*?<\/h\2>\s*)+/i, '')
        .replace(/<h([1-6])\b[^>]*class="[^"]*title[^"]*"[^>]*>[\s\S]*?<\/h\1>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
        .replace(/<[^>]+>/g, '');
    return decodeEntities(text).split('\n');
}

function execute(url) {
    var ids = parseChapterIds(url);
    if (!ids) return Response.error('Không đọc được id chương từ link: ' + url);
    try {
        var content = '';
        var firstError = null;
        try {
            content = fetchContent(ids.bookId, ids.chapterId, false);
        } catch (error) {
            firstError = error;
        }
        // Vài truyện chỉ trả nội dung khi gửi reader_agent=1 (cách bản app đọc nguồn ngoài).
        if (!content) {
            try {
                content = fetchContent(ids.bookId, ids.chapterId, true);
            } catch (error) {
                throw firstError || error;
            }
        }
        var plain = decryptChapter(content);
        var isZip = plain.sigBytes > 4 && plain.words[0] === 0x504b0304;
        var lines = [];
        var images = 0;
        if (isZip) {
            epubPages(toBytes(plain)).forEach(function (page) {
                images += (page.match(/<img\b/gi) || []).length;
                lines = lines.concat(htmlLines(page));
            });
        } else {
            lines = CryptoJS.enc.Utf8.stringify(plain).split(/\r?\n/);
        }
        lines = lines.map(cleanText).filter(function (x) { return x; });
        // Nhiều sách xuất bản là bản scan: mỗi "chương" là một trang ảnh, không có chữ.
        if (!lines.length && images) return Response.success(IMAGE_PAGE_MESSAGE);
        if (!lines.length) throw new Error('Chương trống sau khi giải mã');
        return Response.success(lines.map(escapeHtml).join('<br>'));
    } catch (error) {
        return Response.error('Qimao: ' + error.message + '\nUrl: ' + url);
    }
}
