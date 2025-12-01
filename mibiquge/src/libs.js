// https://stackoverflow.com/a/4673436
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

// https://stackoverflow.com/a/18234317
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

String.prototype.append = function(w) {
    if (this.endsWith(w)) return this;
    return this + w;
}

String.prototype.prepend = function(w) {
    if (this.startsWith(w)) return this;
    return w + this;
}

String.prototype.rtrim = function(s) {
    if (s == undefined) s = '\\s';
    return this.replace(new RegExp("[" + s + "]*$"), '');
}

String.prototype.ltrim = function(s) {
    if (s == undefined) s = '\\s';
    return this.replace(new RegExp("^[" + s + "]*"), '');
}

String.prototype.mayBeFillHost = function(host) {
    var url = this.trim();
    if (!url) return '';
    if (url.startsWith(host)) return url;
    if (url.startsWith('//')) return host.split('//')[0] + url;

    return host.rtrim('/') + '/' + url.ltrim('/');
}

// --------------------------------------------------

var TypeChecker = {
    isString: function(o) {
        return typeof o == "string" || (typeof o == "object" && o.constructor === String);
    }, // https://stackoverflow.com/a/9729103
    isNumber: function(o) {
        return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
    }, // https://stackoverflow.com/a/9729103
    isArray: function(o) {
        return o instanceof Array;
    },
    isFunction: function(o) {
        return o && {}.toString.call(o) === '[object Function]';
    }, // https://stackoverflow.com/a/7356528
    isObject: function(o) {
        return typeof o === 'object' && o !== null;
    }, // https://stackoverflow.com/a/8511332
};

// --------------------------------------------------

function log(o, msg) {
    Console.log('___' + (msg || '') + '___');
    if (TypeChecker.isArray(o)) {
        Console.log(JSON.stringify(o, null, 2));
    }
    else {
        Console.log(o);
    }
}

// --------------------------------------------------

var $ = {
    Q: function(e, q, i) {
        var _empty = Html.parse('').select('body');

        var els = e.select(q);
        if (els == '' || els.size() == 0) return _empty;
        if (i == undefined) return els.first();

        if (typeof(i) == 'number') {
            if (i == -1) return els.last();
            if (i >= els.size()) return _empty;

            return els.get(i);
        } else {
            if (i.remove) {
                els.select(i.remove).remove();
            }
            return els;
        }
    },
    QA: function(e, q, o) {
        var arr = [];
        var els = e.select(q);
        o = o || {};

        if (els == '' || els.size() == 0) return o.j ? '' : arr;

        var processItem = function(item) {
            if (o.f) {
                if (o.f(item)) arr.push(o.m ? o.m(item) : item);
            } else {
                arr.push(o.m ? o.m(item) : item);
            }
        }

        var count = els.size();
        
        if (o.reverse) {
            for (var i = count - 1; i >= 0; i--) {
                var item = els.get(i);
                processItem(item);
            }
        } else {
            for (var i = 0; i < count; i++) {
                var item = els.get(i);
                processItem(item);
            }
        }

        if (o.j && typeof(o.j) == 'string') return arr.join(o.j);

        return arr;
    }

}

function text(doc, selector) {
    var el = $.Q(doc, selector);
    if (el && typeof el.text === 'function') {
        var t = el.text();
        if (typeof t === 'string') {
            return t.trim();
        }
    }
    return '';
}

function cleanHtml(html) {
    //remove <p> 第1章如來神掌之穿越 </p>
    html = html.replace(/<p>\s*第[^<]+章[^<]*<\/p>\s*/gi, "");
    //
    html = html.replace(/\n/g, '<br>');
    // remove duplicate br tags
    html = html.replace(/(<br>\s*){2,}/gm, '<br>');
    // strip html comments
    html = html.replace(/<!--[^>]*-->/gm, '');
    // html decode
    html = html.replace(/&nbsp;/g, '');
    // trim br tags
    html = html.replace(/(^(\s*<br>\s*)+|(<br>\s*)+$)/gm, '');

    return replaceAllDateTime(html.trim());
}

function replaceAllDateTime(text) {
    if (!text) return text;

    // --- 1. Chuẩn hoá số full-width (４月→4月) ---
    text = text.replace(/[\uFF01-\uFF5E]/g, function(ch) {
        // Full-width '！' (U+FF01) → Half-width '!' (U+0021)
        return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    });

    // --- 2. Chuyển các ký tự tiếng Trung sang dạng dễ xử lý ---
    text = text
        .replace(/年/g, '-')         // năm
        .replace(/月/g, '-')         // tháng
        .replace(/日|号/g, '')       // bỏ 日, 号
        .replace(/时|點|点/g, ':')   // giờ
        .replace(/分/g, ':')         // phút
        .replace(/秒/g, '');         // giây

    // --- 3. Chuẩn hoá khoảng trắng ---
    text = text.replace(/\s+/g, ' ');

    // --- 4. Dạng yyyy/MM/dd hoặc yyyy-MM-dd ---
    text = text.replace(/\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/g, function(_, y, m, d) {
        return parseInt(d, 10) + " tháng " + parseInt(m, 10) + " năm " + y;
    });

    // --- 5. Dạng dd/MM/yyyy hoặc dd-MM-yyyy ---
    text = text.replace(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g, function(_, d, m, y) {
        return parseInt(d, 10) + " tháng " + parseInt(m, 10) + " năm " + y;
    });

    // --- 6. Dạng rút gọn kiểu tiếng Trung / Nhật ---
    // a) 月初n hoặc -初n
    text = text.replace(/\b(\d{1,2})(?:月|-)\s*初(\d{1,2})\b/g, function(_, m, d) {
        return parseInt(d, 10) + " tháng " + parseInt(m, 10);
    });

    // b) 月n hoặc -n (ví dụ 3月9, 3-9)
    text = text.replace(/\b(\d{1,2})(?:月|-)\s*(\d{1,2})\b/g, function(_, m, d) {
        return parseInt(d, 10) + " tháng " + parseInt(m, 10);
    });

    // --- 7. Giờ phút giây ---
    // hh:mm:ss → hh giờ mm phút ss giây
    text = text.replace(/\b(\d{1,2}):(\d{1,2}):(\d{1,2})\b/g, function(_, h, m, s) {
        return parseInt(h, 10) + " giờ " + parseInt(m, 10) + " phút " + parseInt(s, 10) + " giây";
    });

    // hh:mm → hh giờ mm phút
    text = text.replace(/\b(\d{1,2}):(\d{1,2})\b/g, function(_, h, m) {
        return parseInt(h, 10) + " giờ " + parseInt(m, 10) + " phút";
    });

    return text;
}

function formatName(name) {
    // Bước 1: Xử lý dạng "1.第1章 ..."
    var reLeading = /^(\d+)\.第(\d+)章\s*/;
    var result = name.replace(reLeading, '第$2章 ');

    // Bước 2: Chuẩn hóa dạng "第1章 1xxx" → "第1章 xxx"
    var reDuplicate = /^第([0-9]+)章\s+\1\s*(.*)$/;
    if (reDuplicate.test(result)) {
        result = result.replace(reDuplicate, '第$1章 $2');
    }

    // Bước 3: Cắt bỏ phần ngoặc (...) hoặc （...）
    var lastParenIndex = Math.max(result.lastIndexOf('('), result.lastIndexOf('（'));
    if (lastParenIndex !== -1) {
        result = result.slice(0, lastParenIndex);
    }

    // Bước 4: Nếu chỉ còn "第X章 【...】", thì return luôn
    var onlyBracket = /^第\d+章\s*【[^】]*】?\s*$/;
    if (onlyBracket.test(result)) {
        return result.trim();
    }

    // Bước 5: Xóa phần sau "【"
    result = result.replace(/【.*$/, '');

    // Bước 6: Chuyển từ phồn thể sang giản thể
    return (result.trim());
}

function getBookId(url) {
    var match = url.match(/_(\d+)\//);
    return match ? match[1] : null;
}

function buildCover(bookid) {
    var folder = bookid.length <= 3 ? "0" : bookid.slice(0, bookid.length - 3);
    return 'http://www.2wxsi.com/files/article/image/' + folder + '/' + bookid + '/' + bookid + 's.jpg';
}