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
    if (TypeChecker.isArray(o) || TypeChecker.isObject(o)) {
        try {
            Console.log(JSON.stringify(o, null, 2));
        } 
        catch(e) {
            Console.log(o);
        }
    }
    else {
        Console.log(o);
    }
}

function cleanHtml(html) {
    html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1<br>');
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
    //
    html = html.trim();
    //
    html = html.replace(/^第[\d\u4e00-\u9fa5]+章.*?<br\s*\/?>/i, '');
    //
    html = html.replace('(本章完)', '');

    return replaceAllDateTime(html.trim());
}

function replaceAllDateTime(text) {
    if (!text) return text;

    // 1️⃣ Chuẩn hoá số full-width -> half-width
    text = text.replace(/[\uFF01-\uFF5E]/g, function(ch) {
        // Full-width '！' (U+FF01) → Half-width '!' (U+0021)
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

        if (o.reverse) {
            for (var i = els.size() - 1; i >= 0; i--) {
                var item = els.get(i);
                processItem(item);
            }
        } else {
            for (var i = 0; i < els.size(); i++) {
                var item = els.get(i);
                processItem(item);
            }
        }

        if (o.j && typeof(o.j) == 'string') return arr.join(o.j);

        return arr;
    }

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

        // Bước 3: Cắt bỏ phần ngoặc (...) hoặc （...）
        var lastParenIndex = Math.max(result.lastIndexOf('('), result.lastIndexOf('（'));
        if (lastParenIndex !== -1) {
            result = result.slice(0, lastParenIndex);
        }

        // Bước 4: Nếu chỉ còn "第X章 【...】", thì return luôn
        var onlyBracket = /^第\d+章\s*【[^】]*】?\s*$/;
        if (onlyBracket.test(result)) {
            return result.trim().length == 0 ? (name) : (result.trim());
        }

        // Bước 5: Xóa phần sau "【"
        result = result.replace(/【.*$/, '');

        // Bước 6: Loại bỏ các phần có trong mảng
        var arrTextRemove = [
            '求月票',
            '求個月票',
            '求首訂',
            '求关注',
            '〔',
            '{',
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

var _fallbackT2S = {
    "０": "0",
    "１": "1",
    "２": "2",
    "３": "3",
    "４": "4",
    "５": "5",
    "６": "6",
    "７": "7",
    "８": "8",
    "９": "9",
}

function convertT2S(text) {
    return text.split('').map(function (ch) {
        return _fallbackT2S[ch] ? _fallbackT2S[ch] : ch;
    }).join('');
}

function getBookid(url) {
    const match = url.match(/\/(\d+)\.html/);
    return match ? match[1] : null;
}