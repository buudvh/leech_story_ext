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

    return html.trim();
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

var TongWen = {
    _zh_s: "风章地第我強的大有萬風回金为三开師開个传為书書梦傳明新绝了天里一人局手之鱼起化絕越宝寶异魔異你这已结年結這生神魚东東太個武八长荒从感進從圣始山不种是在世干文斗鬥成長罗反帝羅種小花番完无到布聖被后仙法美日行者穿当下路身诸諸多星们全发們言當飞超發代飛皇龙间間职都终子終職本只空主打十隻与爱愛無與古夢雨唐夜就修破中南剑合上族国龍能劍系和妖月她女青最國火战好家戰猫外白界吃魂老貓水云末求影九可道雲出又心兽来门变王命獸光門黑统來佬学二球變學死宠重寵请戏游統戲点师請點想啊百自四要强红物紅级带灵靈时帶七乐時樂級杀殺快入么麽说海进說真万",
    _zh_t: "盓盠盪盳盽眀眏睧瞜瞣矵砪硂碒碠碦碭碸碽磄磣礘祘祙禐禞禤禪秙秢秼稧稬稲穐竒笉笜筂筣箏箞箤箿篛篜篭篳簘籜籣籶粖糂糉紂紇紺紻絍絭絳絶綗綡綹緋緗緱縁縈縞縹繤繧繬繯纀纃纉纒罙罯羠耮耴聡肍腀腣腨腵膄膪臚舃舦艊艫艭艶芻苅茿荢莂菓菣菳萈葮蒄蒑蒕蓃蓔蓕蓗蔁蔙蔱蕋蕦蕵薃薗藀藵蘌蘓蘔蚾蜠蝨螥衘衟衸袬裺褜褣褸覇覊覯觓訡訮証詇詗誽諂諦謚謡讌讍讜谻豠豧貮貽賅賚賡赲赹赽趝跾踀踃踨踸蹖躉躛躱躻躿軬軻輒輦輽辢酼醕醥醱鈂鈡鉍銌銒銝鋎鋰鍳鎇鎍鎘鎸鏿鐲鐴鐿鑊閔閽陮靄靱鞪韆韟頜顀颩颱飀飥餇饻馿駋駥騿驥驦髉髏鬉鬢鬸魛魺鯩鯬鰌鰻鱌鱺鲓鳶鵏鵨鵼鶓鶩鷵鸓鸖鸘麵黶鼄鼅",

    convert: function (text, direction) {
        var source = direction === "s2t" ? this._zh_s : this._zh_t;
        var target = direction === "s2t" ? this._zh_t : this._zh_s;
        var result = "";

        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            var idx = source.indexOf(c);
            result += idx !== -1 ? target.charAt(idx) : c;
        }
        return result;
    },

    toSimplified: function (text) {
        return this.convert(text, "t2s");
    },

    toTraditional: function (text) {
        return this.convert(text, "s2t");
    }
};

function formatName(name) {
    var re = /^(\d+)\.第(\d+)章\s*/;
    var result = name.replace(re, '第$2章 ');

    var lastParenIndex = Math.max(result.lastIndexOf('('), result.lastIndexOf('（'));
    if (lastParenIndex !== -1) {
        result = result.slice(0, lastParenIndex);
    }

    var onlyBracket = /^第\d+章\s*【[^】]*】?\s*$/;
    if (onlyBracket.test(result)) {
        return result.trim();
    }

    result = result.replace(/【.*$/, '');

    return result.trim();
}