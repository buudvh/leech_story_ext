// https://stackoverflow.com/a/4673436
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
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

String.prototype.append = function (w) {
    if (this.endsWith(w)) return this;
    return this + w;
}

String.prototype.prepend = function (w) {
    if (this.startsWith(w)) return this;
    return w + this;
}

String.prototype.rtrim = function (s) {
    if (s == undefined) s = '\\s';
    return this.replace(new RegExp("[" + s + "]*$"), '');
}

String.prototype.ltrim = function (s) {
    if (s == undefined) s = '\\s';
    return this.replace(new RegExp("^[" + s + "]*"), '');
}

String.prototype.mayBeFillHost = function (host) {
    var url = this.trim();
    if (!url) return '';
    if (url.startsWith(host)) return url;
    if (url.startsWith('//')) return host.split('//')[0] + url;

    return host.rtrim('/') + '/' + url.ltrim('/');
}

// --------------------------------------------------

var TypeChecker = {
    isString: function (o) {
        return typeof o == "string" || (typeof o == "object" && o.constructor === String);
    }, // https://stackoverflow.com/a/9729103
    isNumber: function (o) {
        return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
    }, // https://stackoverflow.com/a/9729103
    isArray: function (o) {
        return o instanceof Array;
    },
    isFunction: function (o) {
        return o && {}.toString.call(o) === '[object Function]';
    }, // https://stackoverflow.com/a/7356528
    isObject: function (o) {
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

function cleanHtml(html) {
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

    // 1️⃣ Chuẩn hoá ký tự full-width -> half-width
    text = text.replace(/[\uFF01-\uFF5E]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    });

    // 2️⃣ yyyy年M月d日
    text = text.replace(/(\d{4})年(\d{1,2})月(\d{1,2})[日号]?/g, function(_, y, m, d) {
        return "ngày " + parseInt(d, 10) + " tháng " + parseInt(m, 10) + " năm " + y;
    });

    // 3️⃣ yyyy-M-d hoặc yyyy/M/d
    text = text.replace(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/g, function(_, y, m, d) {
        return "ngày " + parseInt(d, 10) + " tháng " + parseInt(m, 10) + " năm " + y;
    });

    // 4️⃣ M月初d
    text = text.replace(/(\d{1,2})月初(\d{1,2})/g, function(_, m, d) {
        return "ngày " + parseInt(d, 10) + " tháng " + parseInt(m, 10);
    });

    // 5️⃣ M月d日 hoặc M月d号
    text = text.replace(/(\d{1,2})月(\d{1,2})[日号]?/g, function(_, m, d) {
        return "ngày " + parseInt(d, 10) + " tháng " + parseInt(m, 10);
    });

    // 6️⃣ hh:mm:ss
    text = text.replace(/(\d{1,2}):(\d{1,2}):(\d{1,2})/g, function(_, h, m, s) {
        return parseInt(h, 10) + " giờ " + parseInt(m, 10) + " phút " + parseInt(s, 10) + " giây";
    });

    // 7️⃣ hh:mm
    text = text.replace(/(\d{1,2}):(\d{1,2})(?!:)/g, function(_, h, m) {
        return parseInt(h, 10) + " giờ " + parseInt(m, 10) + " phút";
    });

    return text;
}

function toCapitalize(sentence) {
    var words = sentence.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.substring(1);
    }
    return words.join(" ");
}

function extractBookId(url, isSTV) {
    var match;
    if (isSTV) {
        match = url.match(/\/(\d+)\/?$/);
    } else {
        match = url.match(/\/(\d+)\.htm/);
    }
    if (!match) {
        throw new Error("Book ID not found in URL");
    }
    return match[1];
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

function formatName(name) {
    try {
        // Bước 1: Xử lý dạng "1.第1章 ..."
        var reLeading = /^(\d+)\.第(\d+)章\s*/;
        var result = name.replace(reLeading, '第$2章 ');

        // Bước 1.5: Nếu có "第X集 第Y章 ..." → bỏ "第X集"
        var reEpisodeChapter = /第[一二三四五六七八九十百千\d]+集\s*(第[一二三四五六七八九十百千\d]+章\s*)/;
        result = result.replace(reEpisodeChapter, '$1');

        // Bước 2: Chuẩn hóa dạng "第1章 1xxx" → "第1章 xxx"
        var reDuplicate = /^第([0-9]+)章\s+\1\s*(.*)$/;
        if (reDuplicate.test(result)) {
            result = result.replace(reDuplicate, '第$1章 $2');
        }

        // // Bước 3: Cắt bỏ phần ngoặc (...) hoặc （...）
        // var lastParenIndex = Math.max(result.lastIndexOf('('), result.lastIndexOf('（'));
        // if (lastParenIndex !== -1) {
        //     result = result.slice(0, lastParenIndex);
        // }

        // // Bước 4: Nếu chỉ còn "第X章 【...】", thì return luôn
        // var onlyBracket = /^第\d+章\s*【[^】]*】?\s*$/;
        // if (onlyBracket.test(result)) {
        //     return result.trim().length == 0 ? (name) : (result.trim());
        // }

        // // Bước 5: Xóa phần sau "【"
        // result = result.replace(/【.*$/, '');

        // Bước 6: Loại bỏ các phần có trong mảng
        var arrTextRemove = [
            '求月票',
            '求個月票',
            '求首訂',
            '求关注',
            '〔',
            '{',
            '(',
            '（'
        ];
        var arrTextLastIndex = arrTextRemove.map(item => result.lastIndexOf(item));
        var filtered = arrTextLastIndex.filter(x => x !== -1);
        var lastTextIndex = filtered.length > 0
            ? Math.min.apply(null, filtered)
            : -1;
        if (lastTextIndex > 0) {
            result = result.slice(0, lastTextIndex);
        }

        // Bước 5: Chuyển từ phồn thể sang giản thể
        return result.trim().length == 0 ? (name) : (result.trim());
    } catch (error) {
        throw error;
    }
}